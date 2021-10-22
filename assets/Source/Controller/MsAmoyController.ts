
import { _decorator, Component, Node, animation, math, input, Input, Touch, EventTouch, EventMouse, systemEvent, SystemEvent } from 'cc';
import { CharacterStatus } from './CharacterStatus';
const { ccclass, property } = _decorator;

@ccclass('MsAmoyController')
export class MsAmoyController extends Component {
    @_decorator.property
    public mouseTurnSpeed = 1.0;

    public start () {
        this._charStatus = this.getComponent(CharacterStatus)!;
        this._animationController = this.getComponent(animation.AnimationController)!;

        const input = systemEvent;
        const Input = SystemEvent;

        input.on(Input.EventType.MOUSE_DOWN, this._onMouseDown, this);
        input.on(Input.EventType.MOUSE_MOVE, this._onMouseMove, this);
        input.on(Input.EventType.MOUSE_UP, this._onMouseUp, this);
        input.on(Input.EventType.TOUCH_START, this._onTouchBegin, this);
        input.on(Input.EventType.TOUCH_MOVE, this._onTouchMove, this);
    }

    public update () {
        const { _charStatus: characterStatus } = this;
        const { localVelocity } = characterStatus;

        const velocity2D = new math.Vec2(localVelocity.x, localVelocity.z);
        // cc.math.Vec2.normalize(velocity2D, velocity2D);
        this._animationController.setValue('VelocityX', -velocity2D.x);
        this._animationController.setValue('VelocityY', velocity2D.y);
    }

    public onCrouchButtonClicked() {
        this._crouching = !this._crouching;
        this._animationController.setValue('Crouching', this._crouching);
    }

    public onJumpClicked() {
        this._animationController.setValue('Jump', true);
    }

    public onReloadClicked() {
        this._animationController.setValue('Reload', true);
    }

    public onFireClicked() {
        if (this._crouching) {
            return;
        }
        this._animationController.setValue('Fire', true);
    }

    public onIronSightsClicked() {
        this._ironSights = !this._ironSights;
        this._animationController.setValue('IronSights', this._ironSights);
    }

    public setVelocityX(value: number) {
        this._animationController.setValue('VelocityX', value);
    }

    public setVelocityY(value: number) {
        this._animationController.setValue('VelocityY', value);
    }

    private _crouching = false;
    private _ironSights = false;
    private declare _charStatus: CharacterStatus;
    private declare _animationController: animation.AnimationController;
    private _turnEnabled = false;

    private _onMouseDown (event: EventMouse) {
        switch (event.getButton()) {
            default:
                break;
            case EventMouse.BUTTON_RIGHT:
                this._turnEnabled = true;
                break;
        }
    }

    private _onMouseMove (event: EventMouse) {
        if (this._turnEnabled) {
            const dx = event.getDeltaX();
            if (dx) {
                const angle = -dx * this.mouseTurnSpeed;
                this.node.rotate(
                    math.Quat.rotateY(new math.Quat(), math.Quat.IDENTITY, math.toRadian(angle)),
                    Node.NodeSpace.WORLD,
                );
            }
        }
    }

    private _onMouseUp (event: EventMouse) {
        switch (event.getButton()) {
            default:
                break;
            case EventMouse.BUTTON_RIGHT:
                this._turnEnabled = false;
                break;
        }
    }

    private _onTouchBegin (eventTouch: EventTouch) {
        
    }

    private _onTouchMove (eventTouch: EventTouch) {
    }
}
