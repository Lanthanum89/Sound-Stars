// The school's ELS "grapheme information sheet" as data: one row per sound with
// its remember-it phrase, in the order the sheet teaches them. Kept apart from
// phonicsGraphemeBank so presentation can use it without touching the test words.
//
// `key` is a graphemeBank key (e.g. "a_ar"), so a sheet entry can start a
// practice round for exactly that sound. In `phrase`, [square brackets] mark
// the letters that make the sound, so highlighting never has to guess (e.g.
// "walk along the wall" must not light up the "al" in "along"). Phase 2-3
// phrases for single letters are handwriting rhymes and are left unmarked.
//
// Phrases are (c) Knowledge Schools Trust Enterprises Ltd 2022 (ELS, Oxford).

import type { Phase } from './phonicsGraphemeBank';

export interface SoundSheetEntry {
  id: string;
  key: string;
  phase: Phase;
  phrase: string;
}

export interface PhraseSegment {
  text: string;
  highlight: boolean;
}

const rows: [key: string, phase: Phase, phrase: string][] = [
  // Phase 2
  ['s', 2, 'snake - swerve around the snake'],
  ['a', 2, 'ant - around the head, down the body'],
  ['t', 2, 'teacher - down her body and cross her shoulders'],
  ['p', 2, 'parrot - down his body, around his face'],
  ['i', 2, 'inventor - down her body, spot her idea'],
  ['n', 2, 'nest - down the bird and over her nest'],
  ['m', 2, 'meerkat - meerkat, mound, mound'],
  ['d', 2, 'duck - over his back and around the tail, up his neck and down to his feet'],
  ['g', 2, 'goat - start at his ear, around the face and down the beard'],
  ['o', 2, "ostrich - around the ostrich's body"],
  ['c', 2, "camel - curl around the camel's back"],
  ['k', 2, 'kid - down the body, up the arm, down the leg'],
  ['ck', 2, 'a camel and a kid - the camel stood by the kid'],
  ['e', 2, 'elephant - around the head and down the trunk'],
  ['u', 2, 'umbrella - under the umbrella and down to the tip'],
  ['r', 2, 'runner - down her body, up over the arm'],
  ['ss', 2, 'two snakes - sunbathing snakes'],
  ['h', 2, 'heron - from his head to his feet, up and over his back'],
  ['b', 2, 'bike - down the person and around the wheel'],
  ['f', 2, 'fox - over the ear, down to the tail and across the jaw'],
  ['ff', 2, 'two foxes - two foxes facing forwards'],
  ['l', 2, 'ladder - down the long ladder'],
  ['ll', 2, 'two ladders - ladders in a line'],

  // Phase 3
  ['j', 3, 'jellyfish - swoop down the tentacles and dot the body'],
  ['v', 3, 'viper - down the tongue, up the tongue'],
  ['w', 3, 'wallaby - hop to the top, land and hop, land and hop'],
  ['x', 3, 'x x x - criss-cross the kiss'],
  ['y', 3, 'yacht - under the hull and down to the anchor'],
  ['z', 3, 'zigzag - zig and zag'],
  ['zz', 3, 'two zigzags - a zigzag duet'],
  ['qu', 3, '[qu]ill - around the feather and down the pen'],
  ['ch', 3, '[ch]ew the [ch]unky [ch]ips'],
  ['sh', 3, 'the [sh]abby [sh]ip [sh]ook'],
  ['th', 3, '[th]ey were [th]irsty'],
  ['ng', 3, 'pi[ng] po[ng]'],
  ['nk', 3, 'oooh! a pi[nk] si[nk]'],
  ['ai', 3, 'w[ai]t for the tr[ai]n'],
  ['ee', 3, 'b[ee] on my kn[ee]'],
  ['igh', 3, 'l[igh]t up the n[igh]t'],
  ['oa', 3, 'fl[oa]t on the m[oa]t'],
  ['oo_short', 3, 'the b[oo]k n[oo]k'],
  ['ar', 3, 'a f[ar] st[ar]'],
  ['ur', 3, 't[ur]n in the s[ur]f'],
  ['oo_long', 3, 'sc[oo]p with a sp[oo]n'],
  ['or', 3, '[or]der some popc[or]n'],
  ['ow', 3, 'pr[ow]l and gr[ow]l'],
  ['oi', 3, 'c[oi]n in the s[oi]l'],
  ['ear', 3, 'cl[ear] that sm[ear]'],
  ['air', 3, 'a p[air] in the l[air]'],
  ['ure', 3, "s[ure] it's the c[ure]"],
  ['er', 3, 'a bitt[er] wint[er]'],
  ['ow_oa', 3, 'go sl[ow] in the sn[ow]'],

  // Phase 5
  ['ay', 5, 'pl[ay] all d[ay]'],
  ['ou', 5, 'a pr[ou]d cl[ou]d'],
  ['ie', 5, 'p[ie] on your t[ie]'],
  ['ea', 5, '[ea]ch have a tr[ea]t'],
  ['oy', 5, "the b[oy] cries 'ah[oy]!'"],
  ['ir', 5, 'a qu[ir]ky sh[ir]t'],
  ['ue', 5, "tr[ue], the sky's bl[ue]"],
  ['aw', 5, 'f[aw]n on the l[aw]n'],
  ['wh', 5, '[wh]ip with a [wh]isk'],
  ['ph', 5, '[ph]oto on a [ph]one'],
  ['ew', 5, 'the cr[ew] fl[ew]'],
  ['oe', 5, 'tipt[oe] past the d[oe]'],
  ['au', 5, 'p[au]se the l[au]nch'],
  ['ey', 5, 'use mon[ey] to buy hon[ey]'],
  ['a-e', 5, 'c[a]k[e] by the l[a]k[e]'],
  ['e-e', 5, 'the athl[e]t[e]s comp[e]t[e]'],
  ['i-e', 5, 't[i]m[e] to sh[i]n[e]'],
  ['o-e', 5, 'n[o]t[e] in an envel[o]p[e]'],
  ['u-e', 5, 't[u]n[e] on the fl[u]t[e]'],
  ['c_soft', 5, '[c]ycle in the [c]ity'],
  ['eigh', 5, 'my n[eigh]bour has a sl[eigh]'],
  ['a_ar', 5, 'follow [a]fter my f[a]ther'],
  ['e_ee', 5, 'sh[e] waved to m[e]'],
  ['i_igh', 5, 't[i]ger in the w[i]ld'],
  ['y_igh', 5, 'fl[y] in the sk[y]'],
  ['y_ee', 5, 'a lovel[y] bab[y]'],
  ['al', 5, 'w[al]k along the w[al]l'],
  ['a_ay', 5, '[a]pricot on your [a]pron'],
  ['ey_ay', 5, 'th[ey] chose gr[ey] paint'],
  ['ea_ay', 5, 'a gr[ea]t br[ea]k!'],
  ['o_oa', 5, "let's b[o]th h[o]st"],
  ['a_o', 5, 'sw[a]llows and sw[a]ns'],
  ['u_oo', 5, 'a b[u]sh f[u]ll of berries'],
  ['u_yoo', 5, 'a [u]nicorn in [u]niform!'],
  ['ch_k', 5, 'the s[ch]ool or[ch]estra'],
  ['ch_sh', 5, 'the [ch]ef has a ma[ch]ine'],
  ['ea_e', 5, 'h[ea]ther in the m[ea]dow'],
  ['ie_e', 5, 'a good fr[ie]nd'],
  ['or_ur', 5, 'the w[or]thy artw[or]k'],
  ['ear_ur', 5, 's[ear]ch for a p[ear]l'],
  ['ou_oo', 5, 'y[ou] make the s[ou]p'],
  ['oul', 5, 'b[oul]der on his sh[oul]der'],
  ['ie_ee', 5, 'a sh[ie]ld in the f[ie]ld'],
  ['ve', 5, 'mo[ve] and groo[ve]'],
  ['y_i', 5, 'a c[y]gnet under the s[y]camore'],
  ['are', 5, 'sh[are] the f[are]'],
  ['ere', 5, "Wh[ere]? 'Over th[ere]!'"],
  ['ear_air', 5, 'a b[ear] ate the p[ear]'],
  ['tch', 5, 'ca[tch] on the la[tch]'],
  ['o_u', 5, 'the m[o]nkey and his m[o]ther'],
  ['g_j', 5, 'an ener[g]etic [g]iraffe'],
  ['ge', 5, 'take char[ge] of the bar[ge]'],
  ['dge', 5, 'squi[dge] on the bri[dge]'],
  ['st', 5, 'li[st]en to the whi[st]le'],
  ['ce', 5, 'dan[ce] on the fen[ce]'],
  ['se', 5, 'a mou[se] in the hou[se]!'],
  ['gn', 5, 'a [gn]ome with a si[gn]'],
  ['kn', 5, '[kn]eel on your [kn]ees'],
  ['wr', 5, '[wr]ap it round your [wr]ist'],
  ['mb', 5, 'the la[mb] cli[mb]ed up'],
  ['se', 5, 'pass the chee[se], plea[se]'],
  ['ze', 5, 'free[ze] in the bree[ze]!'],
  ['eer', 5, 'p[eer] at the d[eer]'],
  ['ere', 5, 'h[ere] is the sph[ere]'],
  ['ti', 5, 'waiting pa[ti]ently at the sta[ti]on'],
  ['al', 5, 'b[al]m on your p[al]m'],
  ['augh', 5, 'she t[augh]t her d[augh]ter'],
  ['ss_sh', 5, 'permi[ss]ion for the mi[ss]ion'],
  ['si', 5, 'the illu[si]on caused confu[si]on'],
  ['ti', 5, 'scrump[ti]ous and nutri[ti]ous'],
  ['ci', 5, 'a spe[ci]al and pre[ci]ous relic'],
];

// Ids must be stable and unique even where a key appears twice (al, se, ere, ti).
const seen = new Map<string, number>();

export const soundSheet: SoundSheetEntry[] = rows.map(([key, phase, phrase]) => {
  const n = (seen.get(key) ?? 0) + 1;
  seen.set(key, n);
  return { id: `${key}-${n}`, key, phase, phrase };
});

/** Splits a phrase on its [bracketed] letters so they can be highlighted. */
export function parsePhrase(phrase: string): PhraseSegment[] {
  return phrase
    .split(/(\[[^\]]+\])/)
    .filter((part) => part.length > 0)
    .map((part) =>
      part.startsWith('[') ? { text: part.slice(1, -1), highlight: true } : { text: part, highlight: false },
    );
}
