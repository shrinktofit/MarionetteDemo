
import { _decorator, Component, Node, animation, math } from 'cc';
import { CharacterStatus } from './CharacterStatus';
const { ccclass, property } = _decorator;

@ccclass('MsAmoyController')
export class MsAmoyController extends Component {
    public start () {
        this._charStatus = this.getComponent(CharacterStatus)!;
        this._animationController = this.getComponent(animation.AnimationController)!;
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
}
