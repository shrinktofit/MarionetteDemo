
import { _decorator, Component, Node, Eventify } from 'cc';
import { Damage } from './Damage';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Damagable
 * DateTime = Mon Oct 25 2021 18:53:40 GMT+0800 (中国标准时间)
 * Author = shrinktofit
 * FileBasename = Damagable.ts
 * FileBasenameNoExtension = Damagable
 * URL = db://assets/Source/GamePlay/Damage/Damagable.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

enum DamageEventType {
    DAMAGE,
}
 
@ccclass('Damageable')
export class Damageable extends Eventify(Component) {
    public static EventType = DamageEventType;
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    start () {
        // [3]
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    public applyDamage(damage: Damage) {
        this.emit(DamageEventType.DAMAGE, damage);
    }
}

export declare namespace Damageable {
    export type EventType = DamageEventType;
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
