//=============================================================================
// DA_TPBchargeMAX_SE.js
//=============================================================================

/*:
 *
 * @target MZ
 * @file DA_TPBchargeMAX_SE
 * @plugindesc A plug-in that plays a sound effect when the TPB gauge is full
 * @author DeathAlice
 * @version 1.0
 *
 * @param chargeMAX_SE
 * @desc Sound effect that plays when the gauge is full
 * @text SE
 * @type file
 * @dir audio/se/
 * @default
 *
 * @param volume
 * @type number
 * @text volume
 * @desc SE volume
 * @default 90
 * @max 100
 * @min 0
 *
 * @param pitch
 * @type number
 * @text pitch
 * @desc SE pitch
 * @default 100
 * @max 150
 * @min 50
 *
 * @param pan
 * @type number
 * @text pan
 * @desc SE pan
 * @default 0
 * @max 100
 * @min -100
 *
 * @help
 * A plug-in that plays a sound effect when the TPB gauge is full.
 * By setting the sound effect in the plug-in, the sound effect will be made during the battle of TPB.
 * Please note that it does not work in turn-based battles.
 *
 * ■ Terms of Use
 * This plugin is under the MIT license.
 * MIT license: http://opensource.org/licenses/mit-license.php
 *
 * 
 */


/*:ja
 *
 * @target MZ
 * @file DA_TPBchargeMAX_SE
 * @plugindesc TPBのゲージがたまった時に効果音が流れるプラグイン
 * @author DeathAlice
 * @version 1.0
 *
 * @param chargeMAX_SE
 * @desc ゲージが溜まった時に流れる効果音
 * @text 効果音
 * @type file
 * @dir audio/se/
 * @default
 *
 * @param volume
 * @type number
 * @text ボリューム
 * @desc 効果音の音量
 * @default 90
 * @max 100
 * @min 0
 *
 * @param pitch
 * @type number
 * @text ピッチ
 * @desc 効果音ピッチ
 * @default 100
 * @max 150
 * @min 50
 *
 * @param pan
 * @type number
 * @text パン
 * @desc 効果音のパン
 * @default 0
 * @max 100
 * @min -100
 *
 * @help
 * TPBのゲージがたまった時に効果音が流れるプラグインです。
 * プラグインで効果音を設定することで、TPBの戦闘中に効果音がなるようになります。
 * ターン制バトルでは動作しないので注意してください。
 *
 * ■利用規約
 * このプラグインはMITライセンスに基づきます。
 * MITライセンス：http://opensource.org/licenses/mit-license.php 
 *
 * 
 */

(() => {
	"use strict";
	var parameters = PluginManager.parameters("DA_TPBchargeMAX_SE");
	const _volume = Number(parameters.volume);
	const _pitch = Number(parameters.pitch);
	const _pan = Number(parameters.pan);
	const _Game_Battler_onTpbCharged = Game_Battler.prototype.onTpbCharged;
	Game_Battler.prototype.onTpbCharged = function() {
		_Game_Battler_onTpbCharged.call(this);
		if(this.isActor())
		{
			AudioManager.playSe({ "name": parameters.chargeMAX_SE, "volume": _volume, "pitch": _pitch, "pan": _pan });
		}
	};

})();
