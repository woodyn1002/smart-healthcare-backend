import * as tf from '@tensorflow/tfjs';
import * as tfnode from '@tensorflow/tfjs-node';
import {CLASSES} from '../tf_models/food/classes';
import * as FoodService from './food';

export function recognize(imageBuffer) {
    const path = tfnode.io.fileSystem("./dist/tf_models/food/model.json");
    return tf.loadGraphModel(path)
        .then(async model => {
            const zeroTensor = tf.zeros([1, 300, 300, 3], 'int32');
            const r = await model.executeAsync(zeroTensor);
            await Promise.all(r.map(t => t.data()));
            r.map(t => t.dispose());
            zeroTensor.dispose();

            const batched = tf.tidy(() => {
                const tfimage = tfnode.node.decodeImage(imageBuffer);
                return tfimage.expandDims(0);
            });

            const result = await model.executeAsync(batched);

            const probability = result[1].dataSync()[0];
            const classId = result[2].dataSync()[0];
            const food = await FoodService.getFood(CLASSES[classId]);

            batched.dispose();
            tf.dispose(result);

            console.debug(`Food detected: id=${classId}, probability=${probability}, food=${JSON.stringify(food)}`);

            return [food];
        });
}