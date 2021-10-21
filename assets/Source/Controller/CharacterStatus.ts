

import * as cc from 'cc';
import { towardVec3 } from '../Utils/Math';

const DEFAULT_ACCELERATION = 1.29 * 4.0;

const VELOCITY_ERROR = 1e-6;
@cc._decorator.ccclass
export class CharacterStatus extends cc.Component {
    get acceleration(): Readonly<cc.math.Vec3> {
        return this._acceleration;
    }

    get velocity (): Readonly<cc.math.Vec3> {
        return this._velocity;
    }

    set velocity (value) {
        cc.math.Vec3.copy(this._targetVelocity, value);
    }

    get localVelocity (): Readonly<cc.math.Vec3> {
        const mat = cc.math.Mat3.fromMat4(new cc.math.Mat3(), this.node.worldMatrix);
        cc.math.Mat3.invert(mat, mat);
        const v = cc.Vec3.transformMat3(new cc.math.Vec3(), this._velocity, mat);
        return v;
    }

    set localVelocity (value: Readonly<cc.math.Vec3>) {
        const worldMatrix = cc.math.Mat3.fromMat4(new cc.math.Mat3(), this.node.worldMatrix);
        const velocity = cc.Vec3.transformMat3(new cc.math.Vec3(), value, worldMatrix);
        this.velocity = velocity;
    }

    public update (deltaTime: number) {
        // deltaTime = 1.0 / 16.0;
        const {
            _velocity: velocity,
            _targetVelocity: targetVelocity,
            _acceleration: acceleration,
        } = this;

        towardVec3(
            velocity,
            targetVelocity,
            cc.math.Vec3.multiplyScalar(new cc.math.Vec3(), acceleration, deltaTime),
            velocity,
        );

        if (cc.math.Vec3.equals(velocity, targetVelocity, VELOCITY_ERROR)) {
            cc.math.Vec3.copy(velocity, targetVelocity);
        }
        
        if (!cc.math.Vec3.equals(velocity, cc.math.Vec3.ZERO, VELOCITY_ERROR)) {
            const newPosition = cc.math.Vec3.scaleAndAdd(
                new cc.math.Vec3(), this.node.position, velocity, deltaTime);
            this.node.setPosition(newPosition);
        }
    }

    private _acceleration = new cc.math.Vec3(DEFAULT_ACCELERATION, DEFAULT_ACCELERATION, DEFAULT_ACCELERATION);

    private _velocity = new cc.math.Vec3();

    private _targetVelocity = new cc.math.Vec3();
}

