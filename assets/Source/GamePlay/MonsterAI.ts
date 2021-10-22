import * as cc from 'cc';
import type { GraphicsGizmo } from '../Utils/GraphicsGizmo';
import { CharacterStatus } from '../Controller/CharacterStatus';
import { injectComponent } from '../Utils/Component';
import { ShapeSelector } from '../Utils/Shape';
import { getForward } from '../Utils/NodeUtils';

@cc._decorator.ccclass('MonsterAI')
export class MonsterAI extends cc.Component {
    @cc._decorator.property
    public minIdleTime = 0.0;

    @cc._decorator.property
    public maxIdleTime = 0.0;

    @cc._decorator.property
    public minSpeed = 1.0;

    @cc._decorator.property
    public maxSpeed = 1.0;

    public declare shapeSelector: ShapeSelector;
    
    update (deltaTime: number) {
        while (!cc.math.approx(deltaTime, 0.0, 1e-5)) {
            switch (this._state) {
                case AIState.NONE:
                    this._onStateNone();
                    break;
                case AIState.IDLE:
                    deltaTime = this._onStateIdle(deltaTime);
                    break;
                case AIState.ROTATING:
                    deltaTime = this._onStateRotate(deltaTime);
                    break;
                case AIState.WALKING:
                    deltaTime = this._onStateWalking(deltaTime);
                    break;
                case AIState.STOPPING:
                    deltaTime = this._onStateStopping(deltaTime);
                    break;
            }
        }
    }

    @injectComponent(CharacterStatus)
    private _characterStatus!: CharacterStatus;

    private _state: AIState = AIState.NONE;

    private _idleStateTimer = 0.0;

    private _walkStateTimer = 0.0;

    private _dest = new cc.math.Vec3();

    private _moveSpeed = 0.0;

    private _onStateNone () {
        this._startIdle();
    }

    private _onStateIdle (deltaTime: number) {
        if (this._idleStateTimer > 0.0) {
            const t = Math.min(deltaTime, this._idleStateTimer);
            this._idleStateTimer -= t;
            return deltaTime - t;
        } else {
            this._startTurn();
            return deltaTime;
        }
    }

    private _onStateWalking (deltaTime: number) {
        if (this._walkStateTimer > 0.0) {
            const t = Math.min(deltaTime, this._walkStateTimer);
            this._walkStateTimer -= deltaTime;
            return deltaTime - t;
        } else {
            this._startStop();
            return deltaTime;
        }
    }

    private _onStateStopping (deltaTime: number) {
        const stopTime = this._characterStatus.calculateAccelerationTime();
        const consumed = Math.min(deltaTime, stopTime);
        this._characterStatus.forceUpdate(consumed);
        if (consumed >= stopTime) {
            this._startIdle();
        }
        return deltaTime - consumed;
    }

    private _onStateRotate(deltaTime: number) {
        const destDir = cc.math.Vec3.subtract(
            new cc.math.Vec3(), this._dest, this.node.worldPosition);
        if (cc.math.Vec3.equals(destDir, cc.math.Vec3.ZERO, 1e-5)) {
            return deltaTime;
        }

        const distToDest = cc.math.Vec3.len(destDir);
        cc.math.Vec3.normalize(destDir, destDir);
        const currentDir = getForward(this.node);
        const rotateAxis = cc.math.Vec3.cross(new cc.math.Vec3(), currentDir, destDir);
        cc.math.Vec3.normalize(rotateAxis, rotateAxis);
        const currentAngle = cc.math.Vec3.angle(
            currentDir,
            destDir,
        );

        if (cc.math.approx(currentAngle, 0.0, 1e-5) || cc.math.approx(currentAngle, Math.PI, 1e-5)) {
            this._startWalk();
            return deltaTime;
        }

        const rotateSpeed = cc.math.toRadian(180.0);
        const timeRequired = currentAngle / rotateSpeed;
        const time = Math.min(deltaTime, timeRequired);
        const q = cc.math.Quat.fromAxisAngle(new cc.math.Quat(), rotateAxis, time * rotateSpeed);
        const rotation = cc.math.Quat.multiply(new cc.math.Quat(), this.node.worldRotation, q);
        this.node.setWorldRotation(rotation);
        
        return deltaTime - time;
    }

    private _startIdle () {
        this._state = AIState.IDLE;
        this._idleStateTimer = cc.math.randomRange(this.minIdleTime, this.maxIdleTime);
    }

    private _startTurn () {
        this._state = AIState.ROTATING;

        const destGround = this.shapeSelector.shape.random();
        const dest = this._dest = new cc.Vec3(destGround.x, 0.0, destGround.y);
        
        this._moveSpeed = cc.randomRange(this.minSpeed, this.maxSpeed);
        this._walkStateTimer = cc.math.Vec3.distance(dest, this.node.worldPosition) / this._moveSpeed;
    }

    private _startWalk () {
        this._state = AIState.WALKING;
        this._characterStatus.localVelocity = cc.math.Vec3.multiplyScalar(new cc.math.Vec3(), cc.math.Vec3.UNIT_Z, this._moveSpeed);
    }

    private _startStop () {
        this._state = AIState.STOPPING;
        this._characterStatus.localVelocity = cc.math.Vec3.ZERO;
    }
}

enum AIState {
    NONE,
    IDLE,
    WALKING,
    STOPPING,
    ROTATING,
}