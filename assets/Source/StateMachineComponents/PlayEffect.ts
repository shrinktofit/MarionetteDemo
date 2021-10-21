import { _decorator, animation, ParticleSystem } from "cc";
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = PlayEffect
 * DateTime = Wed Oct 20 2021 14:26:56 GMT+0800 (中国标准时间)
 * Author = shrinktofit
 * FileBasename = PlayEffect.ts
 * FileBasenameNoExtension = PlayEffect
 * URL = db://assets/Source/StateMachineComponents/PlayEffect.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass("PlayEffect")
export class PlayEffect extends animation.StateMachineComponent {
    
    onEnter (controller: animation.AnimationController) {
        const component = controller.getComponentInChildren<ParticleSystem>(ParticleSystem);
        component?.play();
    }
  
    onExit (controller: animation.AnimationController) {
        const component = controller.getComponentInChildren<ParticleSystem>(ParticleSystem);
        component?.stop();
    }
}
