//=============================================================================
// DA_TPBslip.js
//=============================================================================
/*
 * 
 * @target MZ
 * @file DA_TPBslip
 * @plugindesc Plugin that gradually recovers over time with TPB
 * @author DeathAlice
 * @version 1.1
 *
 * @help
 * It is executed by adding the following tag to the memo field such as state.
 * <slip_HP: HP regeneration rate> // HP will be able to recover gradually.
 * <slip_MP: MP regeneration rate> // MP will be able to recover gradually.
 * <slip_TP: TP regeneration rate> // TP will be able to recover gradually.
 * Example: <slip_HP: -5> // HP will continue to decrease gradually.
 *
 * If there are multiple same tags, their values ​​will be added.
 * Example 1: If an enemy character tagged with <slip_HP: 5> has a state of <slip_HP: 7>
 * The enemy has the same effect as <slip_HP: 12>.
 * Example 2: If the <slip_HP: -5> state and the <slip_HP: 5> state are attached at the same time,
 * The character does not heal (do not take damage).
 *
 * [About the number of 1 course divisions]
 * One course here means the earliest charge time of the character (the time from the end of the character's action to the ability to select the next action).
 * Automatic recovery will be performed according to the time divided by the entered numerical value.
 * The larger this number, the more times you will automatically recover within one course, and the smaller the amount of recovery.
 * The charge time in active mode of TPB is "240" frame by default, so
 * For example, if you enter "12", automatic recovery will be performed once in 20 frames.
 *
 * [About the amount of one recovery]
 * The amount of recovery when automatic recovery is performed is as follows.
 * Amount of recovery at one time = "Value in memo field" * "Upper limit of ability value" / "Number of 1 cool division" / 100
 * Example: When the maximum HP of a character for which <slip_HP: 5> is valid is "1000" and the number of divisions per course is "10",
 * "Memo column value (5)" * "Upper limit of ability value (1000)" / "1 cool division number (10)" / 100 = "One recovery amount (5)"
 *
* ■ Terms of Use
 * This plugin is under the MIT license.
 * MIT license: http://opensource.org/licenses/mit-license.php
 *
 * @param OneCourseDivHP
 * @type number
 * @text 1 course division number ： HP
 * @desc The larger this number, the more times HP will automatically recover and the smaller the amount of recovery.
 * @default 6
 *
 * @param OneCourseDivMP
 * @type number
 * @text 1 course division number ： MP
 * @desc The larger this number, the more times MP will automatically recover and the smaller the amount of recovery.
 * @default 6
 *
 * @param OneCourseDivTP
 * @type number
 * @text 1 course division number ： TP
 * @desc The larger this number, the more times TP will automatically recover and the smaller the amount of recovery.
 * @default 6
 *
 */


/*:ja
 * 
 * @target MZ
 * @file DA_TPBslip
 * @plugindesc TPBで時間経過で徐々に回復するプラグイン
 * @author DeathAlice
 * @version 1.1
 *
 * @help
 * ステートなどのメモ欄に以下のタグを付けることで実行されます。
 * <slip_HP:HP再生率>　	// HPが徐々に回復できるようになります。
 * <slip_MP:MP再生率>　	// MPが徐々に回復できるようになります。
 * <slip_TP:TP再生率>　	// TPが徐々に回復できるようになります。
 * 例：　<slip_HP:-5>	// HPが徐々に減り続けます。
 *
 * また複数同じタグがあった場合、その値は加算されます。
 * 例1：	<slip_HP:5> のタグが付いた敵キャラに <slip_HP:7> のステートが付いた場合、
 *			その敵は <slip_HP:12> と同じ効果になります。
 * 例2：	<slip_HP:-5> のステートと <slip_HP:5> のステートが同時に付いた場合、
 *			そのキャラクターは回復し（ダメージも受け）ません。
 *
 * 【1クール分割数について】
 * ここでの1クールとは、一番早いキャラクターのチャージタイム（キャラクターの行動終了から次の行動選択が可能になるまでの時間）のことを示し、
 * これを入力した数値分分割した時間に合わせて自動回復が行われます。
 * この数値が大きいほど、1クール内で自動回復する回数が多くなり、回復量は細かくなります。
 * 尚、TPBのアクティブモードのチャージタイムはデフォルトで「240」フレームなので、
 * 例えば「12」と入力した場合、20フレームで1回自動回復が行わるようになります。
 *
 * 【1回の回復量について】
 * 自動回復が行わる際の回復量は以下の計算式になります。
 * 1回の回復量 = 「メモ欄の値」* 「能力値の上限値」 / 「1クール分割数」 / 100
 * 例： <slip_HP:5>が有効なキャラの最大HPが「1000」、1クール分割数が「10」の場合、
 *		「メモ欄の値(5)」* 「能力値の上限値(1000)」 / 「1クール分割数(10)」 / 100 = 「1回の回復量(5)」
 *
 * ■利用規約
 * このプラグインはMITライセンスに基づきます。
 * MITライセンス：http://opensource.org/licenses/mit-license.php 
 *
 * @param OneCourseDivHP
 * @type number
 * @text 1クール分割数・HP
 * @desc この数が多い程、HPが自動回復する回数が多くなり回復量は細かくなります。
 * @default 6
 *
 * @param OneCourseDivMP
 * @type number
 * @text 1クール分割数・MP
 * @desc この数が多い程、MPが自動回復する回数が多くなり回復量は細かくなります。
 * @default 6
 *
 * @param OneCourseDivTP
 * @type number
 * @text 1クール分割数・TP
 * @desc この数が多い程、TPが自動回復する回数が多くなり回復量は細かくなります。
 * @default 6
 *
 */

(() => {
	"use strict";
	var parameters = PluginManager.parameters("DA_TPBslip");
	const SlipDIV_HP = Number(parameters.OneCourseDivHP);
	const SlipDIV_MP = Number(parameters.OneCourseDivMP);
	const SlipDIV_TP = Number(parameters.OneCourseDivTP);
	const _Game_Battle_updateTpbIdleTime =Game_Battler.prototype.updateTpbIdleTime;


	Game_Battler.prototype.updateTpbIdleTime = function() {
		_Game_Battle_updateTpbIdleTime.call(this);
		this.Allslip();
	};

	Game_Battler.prototype.findTagAddValue = function(str)
	{
		var tagValue = null;
		var value = 0;
		this.traitObjects().forEach(function(traitObject) {
			tagValue = Number(traitObject.meta[str]);
			value += (isNaN(tagValue)) ? 0 : tagValue;
		});
		return value;
	};

	Game_Battler.prototype.Allslip = function(){
		this.HPslip();
		this.MPslip();
		this.TPslip();
	};

	Game_Battler.prototype.HPslip = function(){
		const slipRateHP = this.findTagAddValue('slip_HP');
		if(slipRateHP != 0){
			this.hpSlipFlame = (isNaN(this.hpSlipFlame)) ? 0 : this.hpSlipFlame + 1;
			this.hpSlipRate = (isNaN(this.hpSlipRate)) ? 0 : this.hpSlipRate;
			if(SlipDIV_HP > 0){
				const flameDIV_HP= Game_Unit.prototype.tpbReferenceTime() / SlipDIV_HP;
				if (this.hpSlipFlame >= flameDIV_HP){
					this.hpSlipFlame = 0;
					this.hpSlipRate += this.mhp * slipRateHP / SlipDIV_HP / 100;
					const value = (slipRateHP < 0) ? -Math.min(Math.ceil(-this.hpSlipRate) , this.maxSlipDamage()) : 
						Math.ceil(this.hpSlipRate);
					this.hpSlipRate -=value;
					this.gainHp(value);
				}
			}
		}
	};

	Game_Battler.prototype.MPslip = function(){
		const slipRateMP = this.findTagAddValue('slip_MP');
		if(slipRateMP != 0){
			this.mpSlipFlame = (isNaN(this.mpSlipFlame)) ? 0 : this.mpSlipFlame + 1;
			this.mpSlipRate = (isNaN(this.mpSlipRate)) ? 0 : this.mpSlipRate;
			if(SlipDIV_MP > 0){
				const flameDIV_MP = Game_Unit.prototype.tpbReferenceTime() / SlipDIV_MP;
				if (this.mpSlipFlame >= flameDIV_MP){
					this.mpSlipFlame = 0;
					this.mpSlipRate += this.mmp * slipRateMP / SlipDIV_MP / 100;
					const value = Math.ceil(this.mpSlipRate);
					this.mpSlipRate -= value;
					this.gainMp(value);
				}
			}
		}
	};

	Game_Battler.prototype.TPslip = function(){
		const slipRateTP = this.findTagAddValue('slip_TP');
		if(slipRateTP != 0){
			this.tpSlipFlame = (isNaN(this.tpSlipFlame)) ? 0 : this.tpSlipFlame + 1;
			this.tpSlipRate = (isNaN(this.tpSlipRate)) ? 0 : this.tpSlipRate;
			if(SlipDIV_TP > 0){
				const flameDIV_TP = Game_Unit.prototype.tpbReferenceTime() / SlipDIV_TP;
				if (this.tpSlipFlame >= flameDIV_TP){
					this.tpSlipFlame = 0;
					this.tpSlipRate += slipRateTP / SlipDIV_TP;
					const value = Math.ceil(this.tpSlipRate);
					this.tpSlipRate -= value;
					this.gainTp(value);
				}
			}
		}
	};

})();