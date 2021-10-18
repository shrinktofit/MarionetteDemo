
import { _decorator, Component, Node, math } from 'cc';
import { CharacterStatus } from '../Controller/CharacterStatus';
import { Joystick, JoystickEventType } from './Joystick';
const { ccclass, property } = _decorator;
 
@ccclass('JoystickInput')
export class JoystickInput extends Component {
    @property(Joystick)
    public joyStick!: Joystick;

    @property(CharacterStatus)
    public characterStatus!: CharacterStatus;

    start () {
        this.joyStick.on(JoystickEventType.MOVE, (joystickDirection: Readonly<math.Vec2>) => {
            const velocity = new math.Vec3(-joystickDirection.x, 0.0, joystickDirection.y);
            math.Vec3.normalize(velocity, velocity);
            math.Vec3.multiplyScalar(velocity, velocity, 1.0);
            this.characterStatus.localVelocity = velocity;
        });

        this.joyStick.on(JoystickEventType.RELEASE, () => {
            this.characterStatus.velocity = math.Vec3.ZERO;
        });
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}
