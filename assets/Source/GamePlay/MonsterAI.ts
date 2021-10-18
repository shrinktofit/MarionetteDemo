import * as cc from 'cc';
import type { GraphicsGizmo } from '../Utils/GraphicsGizmo';
import { CharacterStatus } from '../Controller/CharacterStatus';
import type { MonsterTerritory } from './MonsterTerritory';
import { injectComponent } from '../Utils/Component';

@cc._decorator.ccclass('MonsterAI')
export class MonsterAI extends cc.Component {
    @cc._decorator.property
    public minIdleTime = 0.0;

    @cc._decorator.property
    public maxIdleTime = 0.0;

    public declare territory: MonsterTerritory;
    
    update (deltaTime: number) {
        while (!cc.math.approx(deltaTime, 0.0, 1e-5)) {
            switch (this._state) {
                case StupidState.NONE:
                    this._onStateNone();
                    break;
                case StupidState.IDLE:
                    deltaTime = this._onStateIdle(deltaTime);
                    break;
                case StupidState.ROTATING:
                    deltaTime = this._onStateRotate(deltaTime);
                    break;
                case StupidState.WALKING:
                    deltaTime = this._onStateWalking(deltaTime);
                    break;
            }
        }
    }

    @injectComponent(CharacterStatus)
    private _characterStatus!: CharacterStatus;

    private _state: StupidState = StupidState.NONE;

    private _idleStateTimer = 0.0;

    private _walkStateTimer = 0.0;

    private _walkTarget = new cc.math.Vec3();

    private _walkSpeed = 0.0;

    private _rotateAxis = new cc.math.Vec3();
    private _remainRotationDelta = 0.0;

    private _onStateNone () {
        this._startIdle();
    }

    private _onStateIdle (deltaTime: number) {
        if (this._idleStateTimer > 0.0) {
            const t = Math.min(deltaTime, this._idleStateTimer);
            this._idleStateTimer -= t;
            return deltaTime - t;
        } else {
            this._startWalk();
            return deltaTime;
        }
    }

    private _onStateWalking (deltaTime: number) {
        if (this._walkStateTimer > 0.0) {
            const t = Math.min(deltaTime, this._walkStateTimer);
            this._walkStateTimer -= deltaTime;
            return deltaTime - t;
        } else {
            this._startIdle();
            return deltaTime;
        }
    }

    private _onStateRotate(deltaTime: number) {
        const rotateSpeed = 180.0;
        const angle = Math.min(rotateSpeed * deltaTime, this._remainRotationDelta);
        this.node.rotate(cc.math.Quat.rotateAround(new cc.math.Quat(), cc.math.Quat.IDENTITY, this._rotateAxis, cc.math.toRadian(angle)));
        this._remainRotationDelta -= angle;
        if (!this._remainRotationDelta) {
            this._characterStatus.localVelocity = cc.math.Vec3.multiplyScalar(new cc.math.Vec3(), cc.math.Vec3.UNIT_Z, this._walkSpeed);
            this._state = StupidState.WALKING;
        }
        const consumed = angle / rotateSpeed;
        return deltaTime - consumed;
    }

    private _startIdle () {
        this._state = StupidState.IDLE;
        this._characterStatus.velocity = cc.Vec3.ZERO;
        this._idleStateTimer = cc.math.randomRange(this.minIdleTime, this.maxIdleTime);
    }

    private _startWalk () {
        this._state = StupidState.ROTATING;
        const targetPointGround = this.territory.rangeSelector.range.random();
        this._walkTarget = new cc.Vec3(targetPointGround.x, 0.0, targetPointGround.y);
        this._walkSpeed = cc.randomRange(0.2, 1.0);
        const dir = cc.math.Vec3.subtract(
            new cc.math.Vec3(), this._walkTarget, this.node.position);
        const distance = cc.math.Vec3.len(dir);
        cc.math.Vec3.normalize(dir, dir);
        this._walkStateTimer = distance / this._walkSpeed;

        const currentDir = this.node.forward;
        cc.math.Vec3.cross(this._rotateAxis, currentDir, dir);
        const rotateAngle = cc.math.Vec3.dot(
            dir,
            currentDir
        );
        this._remainRotationDelta = cc.math.toDegree(rotateAngle);
    }
}

enum StupidState {
    NONE,
    IDLE,
    WALKING,
    ROTATING,
}