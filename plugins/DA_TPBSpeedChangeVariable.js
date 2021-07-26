//=============================================================================
// DA_TPBSpeedChangeVariable.js
//=============================================================================
/*
 *:
 * @target MZ
 * @file DA_TPBSpeedChangeVariable
 * @plugindesc It is a plug-in that manages the time when the gauge accumulates in TPB with a variable.
 * @author DeathAlice
 * @version 1.2
 *
 * @help
 * The battle speed here is the speed at which the gauge accumulates.
 * The default is 4 seconds for 240 frames for active and 1 second for 60 frames for weight.
 * If the value of the variable is set to "0 or less", it will be the default value.
 *
 * ■terms of use
 * There are no particular restrictions.
 * It is optional to modify, redistribute, commercialize, and display rights.
 * The author is not responsible, but we will deal with defects to the extent possible.
 *
 * 
 * @param ActiveMode
 * @type boolean
 * @text Change of TPB (active)
 * @desc If you want to use a variable that changes the time progress (active) battle speed, set it to "ON".
 * @on ON
 * @off OFF
 * @default true
 *
 * @param BattleSpeed_ActiveMode
 * @type variable
 * @parent ActiveMode
 * @text TPB (active) battle speed variable
 * @desc The value entered in the variable is the time (frame) until the gauge accumulates.
 * @default 1
 *
 *
 * @param WaitMode
 * @type boolean
 * @text Change of TPB (wait)
 * @desc If you want to use a variable that changes the time progress (wait) battle speed, set it to "ON".
 * @on ON
 * @off OFF
 * @default false
 *
 * @param BattleSpeed_WaitMode
 * @type variable
 * @parent WaitMode
 * @text TPB (wait) battle speed variable
 * @desc The value entered in the variable is the time (frame) until the gauge accumulates.
 * @default 1
 */
 
 
 /*:ja
 * @target MZ
 * @file DA_TPBSpeedChangeVariable
 * @plugindesc TPBにおけるゲージの溜まる時間を変数で管理するプラグインです。
 * @author DeathAlice
 * @version 1.2
 *
 * @help
 * ここでいうバトルスピードは、ゲージのたまる速度です。
 * デフォルトはアクティブは240フレームの4秒、ウェイトは60フレームの1秒となっております。
 * 変数の値を「0以下」にするとデフォルトの値になります。
 *
 * ■利用規約
 * 特に制約はありません。
 * 改変、再配布自由、商用可、権利表示も任意です。
 * 作者は責任を負いませんが、不具合については可能な範囲で対応します。
 *
 * 
 * @param ActiveMode
 * @type boolean
 * @text TPB(アクティブ)の変更
 * @desc タイムプログレス(アクティブ)のバトルスピードを変更する変数を使いたい場合は「ON」にしてください。
 * @on ON
 * @off OFF
 * @default true
 *
 * @param BattleSpeed_ActiveMode
 * @type variable
 * @parent ActiveMode
 * @text TPB(アクティブ)のバトルスピード変数
 * @desc 変数に入力する値はゲージが溜まるまでの時間（フレーム）です。
 * @default 1
 *
 *
 * @param WaitMode
 * @type boolean
 * @text TPB(ウェイト)の変更
 * @desc タイムプログレス(ウェイト)のバトルスピードを変更する変数を使いたい場合は「ON」にしてください。
 * @on ON
 * @off OFF
 * @default false
 *
 * @param BattleSpeed_WaitMode
 * @type variable
 * @parent WaitMode
 * @text TPB(ウェイト)のバトルスピード変数
 * @desc 変数に入力する値はゲージが溜まるまでの時間（フレーム）です。
 * @default 1
 *
 */

(() => {
	"use strict";
	function toBoolean(str)
	{
		if (str == true) {
			return true;
		}
		return (str == "true") ? true : false;
	}
	var parameters = PluginManager.parameters("DA_TPBSpeedChangeVariable");
	var _activeMode = toBoolean(parameters.ActiveMode,true);
	var _waitMode = toBoolean(parameters.WaitMode,false);
	var battleSpeed_active = 240;
	var battleSpeed_wait = 60;
	if(_activeMode || _waitMode){
		Game_Unit.prototype.tpbReferenceTime = function() 
		{
			if (_activeMode && $gameVariables.value(parameters.BattleSpeed_ActiveMode) > 0)
				battleSpeed_active = $gameVariables.value(parameters.BattleSpeed_ActiveMode);
			if (_waitMode && $gameVariables.value(parameters.BattleSpeed_WaitMode) > 0)
				battleSpeed_wait = $gameVariables.value(parameters.BattleSpeed_WaitMode);
			return BattleManager.isActiveTpb() ? battleSpeed_active : battleSpeed_wait;
		};
	}
})();