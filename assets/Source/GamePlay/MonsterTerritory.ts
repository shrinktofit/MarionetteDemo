
import * as cc from 'cc';
import type { GraphicsGizmo } from '../Utils/GraphicsGizmo';
import { CharacterStatus } from '../Controller/CharacterStatus';
import { MonsterAI } from './MonsterAI';
import { ShapeSelector } from '../Utils/Shape';

@cc._decorator.ccclass
export class MonsterTerritory extends cc.Component {
    @cc._decorator.property
    public capacity = 0;

    @cc._decorator.property
    public minScale = 1.0;

    @cc._decorator.property
    public maxScale = 1.0;

    @cc._decorator.property(cc.Prefab)
    public prefab!: cc.Prefab;

    @cc._decorator.property(ShapeSelector)
    public rangeSelector: ShapeSelector = new ShapeSelector();

    public start () {
        // this.node.on(cc.Node.EventType.TRANSFORM_CHANGED, () => {
        //     cc.math.Vec2.set(
        //         this.rangeSelector.range.center,
        //         this.node.position.x,
        //         this.node.position.z,
        //     );
        // });

        if (!this.prefab) {
            return;
        }

        if (this.rangeSelector.range.center) {
            cc.math.Vec2.set(
                this.rangeSelector.range.center,
                this.node.position.x,
                this.node.position.z,
            );
        }
        
        for (let iItem = 0; iItem < this.capacity; ++iItem) {
            const item = cc.instantiate(this.prefab);
            this.node.addChild(item);

            // Random position
            const positionGround = this.rangeSelector.range.random();
            const position = cc.Vec3.set(new cc.Vec3(), positionGround.x, 0.0, positionGround.y);
            item.setPosition(position);

            // Random rotation
            const faceAngle = cc.randomRange(0.0, Math.PI * 2);
            const rotation = cc.Quat.rotateY(new cc.Quat(), item.rotation, faceAngle);
            item.setRotation(rotation);

            const scaleX = cc.randomRange(this.minScale, this.maxScale);
            const scaleY = cc.randomRange(this.minScale, this.maxScale);
            const scaleZ = cc.randomRange(this.minScale, this.maxScale);
            item.setScale(new cc.Vec3(scaleX, scaleY, scaleZ));

            const ai = item.getComponent<MonsterAI>(MonsterAI);
            if (ai) {
                ai.territory = this;
            }
        }
    }

    public onGizmo (context: GraphicsGizmo) {
        this.rangeSelector.range.onGizmo(context);
    }
}
