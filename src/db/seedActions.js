/**
 * 内置标准化健身动作库。
 *
 * action_id 使用语义化字符串而非自增数字，这样后续增补动作时
 * 可以按 id 幂等 upsert，不需要升级数据库版本。
 */

export const SEED_ACTIONS = [
  // ── 胸 ──────────────────────────────────────────────
  {
    action_id: 'chest_barbell_bench_press',
    action_name: '杠铃卧推',
    body_part: '胸',
    action_desc:
      '仰卧于平板凳，双脚踩实地面，握距略宽于肩。将杠铃从架上取下置于胸部正上方，控制下放至碰触胸部中下沿，稍作停顿后推起至手臂接近伸直。',
    force_point:
      '下放时肩胛骨主动后缩下沉、胸部打开，推起时用胸大肌发力把杠铃「推离」身体，而非用肩前侧顶。全程保持背部微弓、臀部贴凳。',
    warning_point:
      '手肘不要完全外张成 90 度，控制在 45-75 度之间以保护肩关节。大重量务必有人保护或使用安全架，杠铃不要弹胸。',
    sort: 1,
  },
  {
    action_id: 'chest_dumbbell_bench_press',
    action_name: '哑铃卧推',
    body_part: '胸',
    action_desc:
      '仰卧平板凳，双手各持哑铃于胸部两侧，掌心相对或朝前。沿弧线向上推起至哑铃接近靠拢，再缓慢下放至胸部两侧、感受胸肌被拉长。',
    force_point:
      '相比杠铃活动幅度更大，顶峰时主动「夹胸」收缩。下放到最低点时前臂保持垂直地面，让张力留在胸肌上。',
    warning_point:
      '下放不要低于肩关节安全范围，避免过度拉伸伤肩。起始上凳时用大腿把哑铃顶到位，不要直接从地面举过头。',
    sort: 2,
  },
  {
    action_id: 'chest_incline_dumbbell_press',
    action_name: '上斜哑铃卧推',
    body_part: '胸',
    action_desc:
      '将训练凳调至 30-45 度上斜，持哑铃仰卧，起始位置在上胸两侧。沿弧线推起至接近靠拢，控制下放回上胸外侧。',
    force_point:
      '重点刺激胸大肌上束。角度不宜超过 45 度，否则发力会明显转移到三角肌前束。',
    warning_point:
      '不要为了推起而耸肩或抬臀离凳。上斜角度越大肩部压力越大，肩有旧伤者从小角度小重量开始。',
    sort: 3,
  },
  {
    action_id: 'chest_dips',
    action_name: '双杠臂屈伸',
    body_part: '胸',
    action_desc:
      '双手撑于双杠，手臂伸直支撑身体。身体略前倾、屈肘下降至肩略低于肘，再撑起回到起始位置。',
    force_point:
      '身体前倾角度越大、胸部参与越多；躯干越直立则肱三头肌参与越多。练胸时保持含胸前倾、双腿略向后。',
    warning_point:
      '下降不要过深以免肩前侧过度受压。初学者可用弹力带或助力器械减重，先做到全程可控再加负重。',
    sort: 4,
  },
  {
    action_id: 'chest_cable_fly',
    action_name: '绳索夹胸',
    body_part: '胸',
    action_desc:
      '站于龙门架中间，双手各握一侧把手，手臂微屈保持固定弧度。以肩为轴向身体前方中线画弧夹拢，顶峰收缩后缓慢还原。',
    force_point:
      '手肘角度全程锁定不变，靠胸肌「合拢」而不是靠伸肘推。顶峰主动挤压 1 秒，还原时控制离心。',
    warning_point:
      '重量过大会导致手臂伸直变成推的动作，失去孤立效果。滑轮高度不同刺激侧重不同，高位偏下胸、低位偏上胸。',
    sort: 5,
  },
  {
    action_id: 'chest_push_up',
    action_name: '俯卧撑',
    body_part: '胸',
    action_desc:
      '双手撑地略宽于肩，身体从头到踝保持一条直线。屈肘下降至胸部接近地面，再推起至手臂伸直。',
    force_point:
      '核心收紧防止塌腰，手掌用力「抓地」外旋，肩胛下沉。推起顶点不要刻意锁死手肘，保持胸肌张力。',
    warning_point:
      '避免撅臀或塌腰这两种代偿。做不动时降低难度（跪姿或撑高上身），不要靠甩头点地凑数。',
    sort: 6,
  },

  // ── 背 ──────────────────────────────────────────────
  {
    action_id: 'back_pull_up',
    action_name: '引体向上',
    body_part: '背',
    action_desc:
      '正握单杠，握距略宽于肩，身体自然悬垂。肩胛先下沉启动，拉动身体上升至下巴过杠，控制下放回完全悬垂。',
    force_point:
      '想象用肘部「拉向腰侧」而不是用手把身体提上去，背阔肌主导。顶点略挺胸，下放全程控制离心 2-3 秒。',
    warning_point:
      '不要借腰腹摆动的惯性上拉。力量不足时用弹力带辅助或做负重下放，比甩动身体更有效。',
    sort: 1,
  },
  {
    action_id: 'back_lat_pulldown',
    action_name: '高位下拉',
    body_part: '背',
    action_desc:
      '坐于下拉器械，大腿卡稳，宽握横杠。上身略后倾 15-20 度，将横杠下拉至上胸位置，再控制回到手臂伸直。',
    force_point:
      '起始先做肩胛下沉再拉，肘部沿身体两侧向下向后走。下拉到位时挺胸、两侧肩胛向中间靠拢。',
    warning_point:
      '不要把杠拉到颈后，这会给肩关节带来不必要的旋转压力。上身后倾不要变成整体后仰的划船动作。',
    sort: 2,
  },
  {
    action_id: 'back_barbell_row',
    action_name: '杠铃划船',
    body_part: '背',
    action_desc:
      '双脚与肩同宽，屈髋前倾至上身与地面约 45 度，背部挺直握住杠铃。将杠铃拉向腹部下沿，顶峰收缩后控制下放。',
    force_point:
      '靠背阔肌与中背发力把杠铃「拉进」身体，肘部贴近躯干。核心与下背全程绷紧维持躯干角度不变。',
    warning_point:
      '弓背是最危险的错误，宁可减重量也要保持脊柱中立。不要靠上身起伏的惯性甩起杠铃。',
    sort: 3,
  },
  {
    action_id: 'back_one_arm_dumbbell_row',
    action_name: '单臂哑铃划船',
    body_part: '背',
    action_desc:
      '一手一膝支撑于训练凳，另一侧手持哑铃自然下垂。将哑铃沿身体侧后方拉至腰侧，顶峰停顿后缓慢放回。',
    force_point:
      '单侧训练幅度更大，顶点让同侧肩胛充分后缩。拉起轨迹略向后，像「把哑铃放进后裤兜」。',
    warning_point:
      '不要用躯干旋转带动重量。支撑侧手臂不要锁死塌肩，保持肩胛稳定支撑。',
    sort: 4,
  },
  {
    action_id: 'back_seated_cable_row',
    action_name: '坐姿绳索划船',
    body_part: '背',
    action_desc:
      '坐于器械，双脚踩稳踏板，膝微屈。挺胸握把手，将把手拉向腹部，肩胛向中间收紧，再控制手臂前伸还原。',
    force_point:
      '躯干尽量保持稳定，靠肩胛后缩与背阔肌收缩完成动作。还原时让肩胛充分前伸，把背部拉长。',
    warning_point:
      '避免用腰部前后大幅摆动借力。膝关节不要完全锁直，减少下背代偿。',
    sort: 5,
  },
  {
    action_id: 'back_deadlift',
    action_name: '硬拉',
    body_part: '背',
    action_desc:
      '双脚与髋同宽，杠铃贴近小腿。屈髋屈膝握杠，背部挺直、肩略在杠前。腿部与髋同时发力站起，杠铃贴腿上行至完全站直，再沿原轨迹放回。',
    force_point:
      '起始像「把地面推开」，髋与膝同步伸展。全程杠铃贴近身体、背部中立，顶点收紧臀部而不是后仰。',
    warning_point:
      '弓背硬拉极易伤及下背与椎间盘，务必先用轻重量掌握髋铰链模式。不要在顶点过度后仰挤压腰椎。',
    sort: 6,
  },

  // ── 肩 ──────────────────────────────────────────────
  {
    action_id: 'shoulder_overhead_press',
    action_name: '站姿杠铃推举',
    body_part: '肩',
    action_desc:
      '双脚与肩同宽站立，杠铃置于上胸前锁骨位置，握距略宽于肩。核心收紧，垂直向上推起至手臂伸直、杠铃位于头顶正上方，控制下放回起始位。',
    force_point:
      '推起瞬间头部略后收让出轨迹，杠铃过额后头再回到中立。三角肌前中束主导，臀腹绷紧防止腰部代偿。',
    warning_point:
      '不要用下肢屈伸借力（那属于借力推举）。腰椎过度前凸是最常见代偿，收紧核心、必要时改坐姿推举。',
    sort: 1,
  },
  {
    action_id: 'shoulder_dumbbell_press',
    action_name: '坐姿哑铃推举',
    body_part: '肩',
    action_desc:
      '坐于有靠背的训练凳，双手持哑铃于耳侧略高处，掌心朝前。沿略内收的弧线向上推起至接近靠拢，再控制下放至耳侧。',
    force_point:
      '靠背提供稳定，可专注三角肌发力。下放至上臂与地面平行附近即可，保持肩部张力。',
    warning_point:
      '不要下放过深造成肩关节过度外旋。推起时避免耸肩带动，肩胛保持下沉。',
    sort: 2,
  },
  {
    action_id: 'shoulder_lateral_raise',
    action_name: '侧平举',
    body_part: '肩',
    action_desc:
      '站立，双手持哑铃置于体侧，手肘微屈。向身体两侧抬起至上臂与地面平行，稍停后缓慢下放。',
    force_point:
      '孤立三角肌中束。想象用肘部领先带动，小指侧略高，避免用手腕上翻。抬到平行即止，再高会转为斜方肌发力。',
    warning_point:
      '重量过大必然出现耸肩和身体摆动，这个动作宁轻勿重。下放不要完全放松砸回体侧。',
    sort: 3,
  },
  {
    action_id: 'shoulder_front_raise',
    action_name: '前平举',
    body_part: '肩',
    action_desc:
      '站立持哑铃于身体前侧，掌心朝下。向前抬起至与地面平行或略高，控制下放还原。',
    force_point:
      '孤立三角肌前束，手臂保持接近伸直但不锁死。可双手交替进行以更好控制节奏。',
    warning_point:
      '避免用腰部后仰借力。若已安排大量卧推与推举，前束刺激通常已足够，此动作不必做太多。',
    sort: 4,
  },
  {
    action_id: 'shoulder_face_pull',
    action_name: '面拉',
    body_part: '肩',
    action_desc:
      '将绳索调至面部高度，双手对握绳头。将绳索拉向面部，同时肘部向外上方打开、双手向两侧分开，顶峰停顿后控制还原。',
    force_point:
      '目标是三角肌后束与中背。拉到位时上臂外旋、肩胛后缩，形成「双手举过头两侧」的姿态。',
    warning_point:
      '这是改善圆肩与肩健康的动作，用轻重量高次数即可。不要变成用背阔肌下拉的划船动作。',
    sort: 5,
  },
  {
    action_id: 'shoulder_bent_over_lateral_raise',
    action_name: '俯身侧平举',
    body_part: '肩',
    action_desc:
      '屈髋前倾至上身接近平行地面，双手持哑铃自然下垂。向两侧抬起至上臂与地面平行，控制下放。',
    force_point:
      '孤立三角肌后束。保持背部挺直、颈部中立，靠肩关节水平外展完成动作。',
    warning_point:
      '不要靠上身起伏甩起哑铃。可俯卧在上斜凳上做以排除下背负担与借力空间。',
    sort: 6,
  },

  // ── 腿 ──────────────────────────────────────────────
  {
    action_id: 'leg_barbell_squat',
    action_name: '杠铃深蹲',
    body_part: '腿',
    action_desc:
      '杠铃置于上背斜方肌处，双脚与肩同宽或略宽、脚尖略外展。屈髋屈膝下降至大腿至少与地面平行，再蹬地站起至完全直立。',
    force_point:
      '下降时髋膝同步、膝盖沿脚尖方向推出，重心落在全脚掌。起身时想象「用背把杠铃顶起来」，核心全程绷紧。',
    warning_point:
      '膝内扣与起身时臀部先抬导致的弓背都要避免。柔韧不足者先练到能保持背部中立的深度，不必强求全蹲。',
    sort: 1,
  },
  {
    action_id: 'leg_romanian_deadlift',
    action_name: '罗马尼亚硬拉',
    body_part: '腿',
    action_desc:
      '直立持杠铃于体前，膝关节保持微屈固定。以髋为轴向后送髋、上身前倾下放杠铃至大腿中段或膝下，感受股后侧拉紧后回到直立。',
    force_point:
      '核心是髋铰链而非屈膝。杠铃贴腿下滑，臀腿后侧被拉长的感觉是动作正确的标志。',
    warning_point:
      '不要弯腰下放，脊柱全程中立。下放深度以股后侧拉紧不塌背为界，不必强行触地。',
    sort: 2,
  },
  {
    action_id: 'leg_press',
    action_name: '腿举',
    body_part: '腿',
    action_desc:
      '坐于腿举器械，双脚与肩同宽踩于踏板。屈膝下放至膝关节约 90 度或略深，再蹬起至接近伸直。',
    force_point:
      '腰背贴紧靠垫，用全脚掌均匀蹬踏板。可通过双脚位置高低微调股四头与臀腿的侧重。',
    warning_point:
      '顶点不要完全锁死膝关节。下放过深会导致臀部离开靠垫、腰椎屈曲受压，务必控制幅度。',
    sort: 3,
  },
  {
    action_id: 'leg_bulgarian_split_squat',
    action_name: '保加利亚分腿蹲',
    body_part: '腿',
    action_desc:
      '后脚脚背搭于身后训练凳，前脚向前跨出一大步。屈前腿下降至后膝接近地面，再用前腿蹬起还原。',
    force_point:
      '单腿主导，对臀腿刺激强且能纠正双侧力量差异。上身略前倾可增加臀部参与。',
    warning_point:
      '前脚跨得太近会让膝盖压力过大，调整到下蹲时小腿接近垂直。平衡不稳先徒手练熟再加负重。',
    sort: 4,
  },
  {
    action_id: 'leg_extension',
    action_name: '腿屈伸',
    body_part: '腿',
    action_desc:
      '坐于器械，小腿贴于阻力垫下方。伸膝将小腿抬至接近水平，顶峰收缩股四头肌，控制还原。',
    force_point:
      '孤立股四头肌。顶点主动绷紧 1 秒，还原时保持张力不要让配重砸回。',
    warning_point:
      '膝关节有伤者慎用大重量，末端锁膝对髌骨压力较大。调整靠背使膝关节与器械转轴对齐。',
    sort: 5,
  },
  {
    action_id: 'leg_curl',
    action_name: '腿弯举',
    body_part: '腿',
    action_desc:
      '俯卧或坐于腿弯举器械，脚踝抵住阻力垫。屈膝将小腿向臀部方向卷起，顶峰停顿后缓慢还原。',
    force_point:
      '孤立股二头肌。髋部贴紧器械不要抬起，靠屈膝而非甩腿完成。',
    warning_point:
      '避免用臀部抬起借力。还原不要完全放松，控制离心才是股后侧增长的关键。',
    sort: 6,
  },
  {
    action_id: 'leg_calf_raise',
    action_name: '提踵',
    body_part: '腿',
    action_desc:
      '站立（可持哑铃或用器械负重），前脚掌踩于台阶边缘。踝关节充分下沉拉长小腿，再用力踮起至最高点。',
    force_point:
      '幅度决定效果：底部充分下沉、顶点充分踮起并停顿。小腿耐力强，适合较高次数。',
    warning_point:
      '不要靠膝关节屈伸弹跳借力。底部下沉要缓慢可控，避免跟腱被突然拉扯。',
    sort: 7,
  },

  // ── 核心 ────────────────────────────────────────────
  {
    action_id: 'core_plank',
    action_name: '平板支撑',
    body_part: '核心',
    action_desc:
      '肘部与前臂撑地，肘关节位于肩正下方，双脚踩地。身体从头到踝保持一条直线，保持该姿势静态支撑。',
    force_point:
      '腹部与臀部同时收紧、骨盆略后倾以消除腰部塌陷。呼吸保持平稳，不要憋气。',
    warning_point:
      '塌腰会把负荷转到腰椎，撅臀则失去训练效果。质量优先于时长，姿态一变形立刻结束这一组。',
    sort: 1,
  },
  {
    action_id: 'core_crunch',
    action_name: '卷腹',
    body_part: '核心',
    action_desc:
      '仰卧屈膝，双手轻置于耳侧或胸前。用腹部力量把上背卷离地面，肩胛离地即可，控制还原至上背轻触地面。',
    force_point:
      '重点是「脊柱逐节卷曲」而非整体抬起。下巴不要死顶胸口，顶峰主动挤压腹肌。',
    warning_point:
      '不要用手抱头往前拽颈椎。腰部无需完全离地，那属于仰卧起坐、更多是髋屈肌发力。',
    sort: 2,
  },
  {
    action_id: 'core_hanging_leg_raise',
    action_name: '悬垂举腿',
    body_part: '核心',
    action_desc:
      '双手握单杠悬垂，身体保持稳定。用腹部力量将双腿抬起至与地面平行或更高，控制缓慢下放。',
    force_point:
      '抬腿同时略做骨盆后倾，让下腹充分参与。下放全程控制，不要让双腿自由落下。',
    warning_point:
      '身体前后摆动说明重量或幅度超出能力，可先屈膝举腿降低难度。握力不足可用助力带。',
    sort: 3,
  },
  {
    action_id: 'core_russian_twist',
    action_name: '俄罗斯转体',
    body_part: '核心',
    action_desc:
      '坐地屈膝，上身后倾约 45 度，双手持重物于胸前。以躯干旋转带动重物左右移动至体侧，交替进行。',
    force_point:
      '旋转发生在胸腰段而非手臂挥动，目标是腹斜肌。上身角度保持稳定不要随旋转起伏。',
    warning_point:
      '避免快速大幅甩动带来的腰椎剪切力，宁慢求稳。下背不适者改用站姿绳索转体。',
    sort: 4,
  },
  {
    action_id: 'core_dead_bug',
    action_name: '死虫式',
    body_part: '核心',
    action_desc:
      '仰卧，双臂垂直向上、髋膝屈曲 90 度。缓慢伸展对侧手臂与腿至接近地面，还原后换另一侧交替进行。',
    force_point:
      '全程保持下背贴地、骨盆稳定，这是动作的唯一评价标准。配合呼气完成伸展。',
    warning_point:
      '腰部一旦拱起离地就说明幅度过大，缩小范围。这是抗伸展的稳定性训练，不追求次数和速度。',
    sort: 5,
  },
  {
    action_id: 'core_side_plank',
    action_name: '侧平板支撑',
    body_part: '核心',
    action_desc:
      '侧卧，一侧肘与前臂撑地位于肩下，双脚叠放。将髋部抬起使身体成一条直线，保持静态支撑后换另一侧。',
    force_point:
      '侧腹与臀中肌共同发力顶住髋部。头、肩、髋、踝在同一平面，不要前后倾倒。',
    warning_point:
      '髋部下沉即失去效果，坚持不住就结束。支撑侧肩部不要塌陷，保持肩胛主动下沉支撑。',
    sort: 6,
  },

  // ── 手臂 ────────────────────────────────────────────
  {
    action_id: 'arm_barbell_curl',
    action_name: '杠铃弯举',
    body_part: '手臂',
    action_desc:
      '直立握杠铃于体前，掌心朝前、握距与肩同宽。屈肘将杠铃卷起至接近肩前，顶峰收缩后缓慢下放至手臂接近伸直。',
    force_point:
      '上臂固定于体侧，只有肘关节屈伸。顶峰主动挤压肱二头肌，离心下放 2-3 秒。',
    warning_point:
      '身体前后摆动借力是最常见问题，可背靠墙执行。下放不要完全松掉张力，也不要锁死肘关节。',
    sort: 1,
  },
  {
    action_id: 'arm_alternating_dumbbell_curl',
    action_name: '哑铃交替弯举',
    body_part: '手臂',
    action_desc:
      '直立双手持哑铃于体侧，掌心朝前或中立。单侧屈肘卷起至肩前并略做外旋，控制下放后换另一侧。',
    force_point:
      '交替进行便于集中注意力在单侧收缩。卷起过程中前臂外旋可让肱二头肌更充分缩短。',
    warning_point:
      '不要靠肩部前摆把哑铃甩上去。两侧节奏保持一致，避免形成力量与围度差异。',
    sort: 2,
  },
  {
    action_id: 'arm_hammer_curl',
    action_name: '锤式弯举',
    body_part: '手臂',
    action_desc:
      '直立持哑铃于体侧，掌心相对保持中立握。屈肘将哑铃卷起至肩前，全程保持中立握，控制下放。',
    force_point:
      '中立握更多刺激肱桡肌与肱肌，对手臂整体厚度贡献明显。上臂贴紧体侧不要前后移动。',
    warning_point:
      '同样避免躯干晃动借力。手腕保持中立不要向内塌陷，减少腕关节压力。',
    sort: 3,
  },
  {
    action_id: 'arm_close_grip_bench_press',
    action_name: '窄距卧推',
    body_part: '手臂',
    action_desc:
      '仰卧平板凳，握距约与肩同宽。下放杠铃至下胸位置，手肘贴近躯干，再推起至手臂接近伸直。',
    force_point:
      '肘部内收贴身使肱三头肌成为主导。推起最后一段主动锁伸肘关节，感受三头收缩。',
    warning_point:
      '握距不要窄到双手相碰，那会给腕关节带来很大压力。保持与肩同宽或略窄即可。',
    sort: 4,
  },
  {
    action_id: 'arm_triceps_pushdown',
    action_name: '绳索下压',
    body_part: '手臂',
    action_desc:
      '面对高位滑轮，双手握绳索或直杠，上臂贴紧体侧。伸肘向下压至手臂完全伸直，顶峰停顿后控制还原至前臂接近水平。',
    force_point:
      '上臂全程锁定不动，只有肘关节屈伸。用绳索时末端可向两侧外分以加强收缩。',
    warning_point:
      '不要靠上身前倾用体重下压。还原不要超过前臂水平太多，以免肩关节代偿。',
    sort: 5,
  },
  {
    action_id: 'arm_overhead_triceps_extension',
    action_name: '过顶臂屈伸',
    body_part: '手臂',
    action_desc:
      '坐姿或站姿，双手持哑铃或绳索举于头顶。屈肘将重物下放至头后，感受肱三头肌被拉长，再伸肘推回头顶上方。',
    force_point:
      '过顶姿态能充分拉长肱三头肌长头，是增长围度的关键角度。上臂保持垂直、肘部尽量不外张。',
    warning_point:
      '下放速度务必可控，头后方是脆弱位置。肩部柔韧不足或有伤者改用单臂或绳索版本。',
    sort: 6,
  },
]
