/*--------------------------------------------------------------------------
　絶対回避 ver 1.0
■作成者
キュウブ

■概要
自作で使用している絶対回避スキルorステートです。
必中だろうが問答無用で回避するようになります。

■使い方
スキルで設定したい場合
カスタムキーワードで"superAvoid"と設定します。

ステートで設定したい場合
カスタムパラメータでisSuperAvoid:trueを設定します。

■更新履歴

■対応バージョン
SRPG Studio Version:1.161

■規約
・利用はSRPG Studioを使ったゲームに限ります。
・商用・非商用問いません。フリーです。
・加工等、問題ありません。
・クレジット明記無し　OK (明記する場合は"キュウブ"でお願いします)
・再配布、転載　OK (バグなどがあったら修正できる方はご自身で修正版を配布してもらっても構いません)
・wiki掲載　OK
・SRPG Studio利用規約は遵守してください。

--------------------------------------------------------------------------*/
(function() {

var alias = AttackEvaluator.HitCritical.isHit;
AttackEvaluator.HitCritical.isHit = function(virtualActive, virtualPassive, attackEntry) {

	if (SkillControl.checkAndPushCustomSkill(virtualPassive.unitSelf, virtualActive.unitSelf, attackEntry, false, 'superAvoid') ||
		StateControl.getSuperAvoidState(virtualPassive.unitSelf)) {
		this._skill = null;//必中攻撃は無効化
		return false;
	}

	// 命中するかどうかは確率で計算
	return alias.call(this, virtualActive, virtualPassive, attackEntry);
};

// 確率発動スキルの定義
var alias1 = SkillRandomizer.isCustomSkillInvokedInternal;
SkillRandomizer.isCustomSkillInvokedInternal = function(active, passive, skill, keyword) {
	if (keyword === 'superAvoid') {
		// 発動型でない場合は、単純にtrueを返すだけでよい
		return this._isSkillInvokedInternal(active, passive, skill);
	}
	
	return alias1.call(this, active, passive, skill, keyword);
};

})();

StateControl.getSuperAvoidState = function(unit) {
	var i, state;
	var list = unit.getTurnStateList();
	var count = list.getCount();

	for (i = 0; i < count; i++) {
		state = list.getData(i).getState();
		if (state.custom.isSuperAvoid === true) {
			
			return state;
		}
	}

	return null;	
};