import { filterTextToOptions, matchesBasicFilter, parseBasicFilterText, textToFilter } from './Filter';

test.each(
    [
        ['', undefined],
        ['tag', undefined],
        ['tag=', { filterType: 'tag', op: '=', values: '', search: '' }],
        ['tag=happy', { filterType: 'tag', op: '=', values: '', search: 'happy' }],
        ['tag=happy, ends sad', { filterType: 'tag', op: '=', values: 'happy,', search: 'ends sad' }],
    ]
)('%s should match', (input, output) => {
    expect(matchesBasicFilter(input)?.groups).toEqual(output);
});

const withoutTags = (tags: string[]) => ({ tags: { every: { OR: [{ name: { not: { in: tags } } }, { name: { equals: null } }] } } });
const withTags = (tags: string[]) => ({ tags: { some: { name: { in: tags } } } });

describe('parseBasicFilterText', () => {
    test.each(
        [
            ['', undefined],
            ['tag', undefined],
            ['tag=', undefined],
            ['tag=happy', withTags(['happy'])],
            ['tag=happy, ends sad', withTags(['happy', 'ends sad'])],
            ['tag[1]=happy', { tags: { some: { name: { in: ['happy'] }, createdById: 1 } } }],
        ]
    )('%s should parse basic filter', (input, output) => {
        expect(parseBasicFilterText(input)).toEqual(output);
    });
})

describe('textToFilter', () => {
    test.each(
        [
            ['', undefined],
            ['tag', undefined],
            ['tag=', undefined],
            ['tag=happy', withTags(['happy'])],
            ['tag[1]=happy', { tags: { some: { name: { in: ['happy'] }, createdById: 1 } } }],
            ['tag = happy, ends sad   ', withTags(['happy', 'ends sad'])],
            ['tag! happy, ends sad   ', withoutTags(['happy', 'ends sad'])],
            ['tag!happy | status=Completed', { OR: [withoutTags(['happy']), { status: { in: ['Completed'] } }] }],
            ['tag!happy & status=Completed', { AND: [withoutTags(['happy']), { status: { in: ['Completed'] } }] }],
            ['(tag!happy & status=Completed) | (tag  =ends sad, ends happy? )', { OR: [{ AND: [withoutTags(['happy']), { status: { in: ['Completed'] } }] }, withTags(['ends sad', 'ends happy?'])] }],
            ['(tag!happy & status=Completed | (tag  =ends sad, ends happy? )', { OR: [{ AND: [withoutTags(['happy']), { status: { in: ['Completed'] } }] }, withTags(['ends sad', 'ends happy?'])] }], // unmatched brackets
            ['tag!happy |', withoutTags(['happy'])], // unfinished clause
            ['tag!happy &', withoutTags(['happy'])], // unfinished clause
            ['tag!happy &&', withoutTags(['happy'])], // too many clause and unfinished
            ['tag!happy &   ', withoutTags(['happy'])], // unfinished clause
            ['(tag!happy &   (', withoutTags(['happy'])], // unfinished clause
            ['(tag=happy & (tag=ends sad | (tag=historical,fantasy & status=Completed)))', { AND: [withTags(['happy']), { OR: [withTags(['ends sad']), { AND: [withTags(['historical', 'fantasy']), { status: { in: ['Completed'] } }] }] }] }],
            ['(bla=happy & (tag=ends sad | (tag=historical,fantasy & status=Completed)))', { OR: [withTags(['ends sad']), { AND: [withTags(['historical', 'fantasy']), { status: { in: ['Completed'] } }] }] }],
            ['title~rev', { title: { contains: 'rev' } }],
            ['country=China', { country: { in: ['China'] } }],
            ['country=China,South Korea', { country: { in: ['China', 'South Korea'] } }],
            ['country!China,South Korea,Japan,Taiwan,Thailand,Hong Kong,Philippines,Other', { OR: [{ country: { not: { in: ['China', 'South Korea', 'Japan', 'Taiwan', 'Thailand', 'Hong Kong', 'Philippines', 'Other'] } } }, { country: { equals: null } }] }],
            ['episodeCount<40', { episodeCount: { lt: 40 } }],
            ['episodeCount>40', { episodeCount: { gt: 40 } }],
            ['episodeCount=40', { episodeCount: { in: [40] } }],
            ['episodeCount=40,45', { episodeCount: { in: [40, 45] } }],
            ['finishedAiringAt>2020-01-01', { finishedAiringAt: { gt: '2020-01-01' } }],
        ]
    )('%s should return correct filter', (input, output) => {
        expect(textToFilter(input)).toEqual(output);
    });
})

describe('filterTextToOptions', () => {
    test.each([
        ['', , [{ value: "tag" }, { value: "status" }, { value: "title" }, { value: 'watched' }, { value: 'country' }, { value: 'episodeCount' }, { value: 'episodeDuration' }, { value: 'finishedAiringAt' }]],
        ['epi', , [{ value: 'episodeCount' }, { value: 'episodeDuration' }]],
        ['watc', , [{ value: 'watched' }]],
        ['watched', , [{ value: 'watched[1]' }, { value: 'watched[2]' }]],
        ['watched[1]', , [{ value: 'watched[1]=' }, { value: 'watched[1]!' }]],
        ['watched[1]=', , [{ value: 'watched[1]=yes' }, { value: 'watched[1]=no' }, { value: 'watched[1]=dropped' }]],
        ['watched[1]!', , [{ value: 'watched[1]!yes' }, { value: 'watched[1]!no' }, { value: 'watched[1]!dropped' }]],
        ['country', , [{ value: "country=" }, { value: "country!" }]],
        ['country=', , [{ value: "country=China" }, { value: "country=South Korea" }, { value: "country=Japan" }, { value: "country=Taiwan" }, { value: "country=Thailand" }, { value: "country=Hong Kong" }, { value: "country=Philippines" }, { value: "country=Other" }]],
        ['country=ko', , [{ value: "country=South Korea" }, { value: "country=Hong Kong" }]],
        ['episodeCount', , [{ value: "episodeCount=" }, { value: "episodeCount>" }, { value: "episodeCount<" }]],
        ['episodeDuration', , [{ value: "episodeDuration=" }, { value: "episodeDuration>" }, { value: "episodeDuration<" }]],
        ['finishedAiringAt', , [{ value: "finishedAiringAt=" }, { value: "finishedAiringAt>" }, { value: "finishedAiringAt<" }]],
        ['status=', , [{ value: "status=Completed" }, { value: "status=Completed - Missing Subs" }, { value: "status=Ongoing" }, { value: "status=Upcoming" }]],
        ['status=co', , [{ value: "status=Completed" }, { value: "status=Completed - Missing Subs" }, { value: "status=Upcoming" }]],
        ['sta', , [{ value: "status" }]],
        ['status', 3, [{ value: "statustus", pos: 6 }]], // TODO, value should just be status
        ['tag', , [{ value: "tag=" }, { value: "tag!" }, { value: "tag[1]" }, { value: "tag[2]" }]],
        ['tag=', , [{ value: 'tag=apple' }, { value: 'tag=banana' }, { value: 'tag=apple 2' }]],
        ['tag[1]=', , [{ value: 'tag[1]=apple' }, { value: 'tag[1]=banana' }, { value: 'tag[1]=apple 2' }]],
        ['tag[1]', , [{ value: 'tag[1]=' }, { value: 'tag[1]!' }]],
        ['tag=ap', , [{ value: 'tag=apple' }, { value: 'tag=apple 2' }]],
        ['tag=apple ', , [{ value: "tag=apple & " }, { value: "tag=apple | " }, { value: "tag=apple 2" }]],
        ['tag=apple & ', , [{ value: "tag=apple & tag" }, { value: "tag=apple & status" }, { value: "tag=apple & title" }, { value: "tag=apple & watched" }, { value: "tag=apple & country" }, { value: "tag=apple & episodeCount" }, { value: "tag=apple & episodeDuration" }, { value: "tag=apple & finishedAiringAt" }]],
        ['tag=apple &', , [{ value: "tag=apple & tag" }, { value: "tag=apple & status" }, { value: "tag=apple & title" }, { value: "tag=apple & watched" }, { value: "tag=apple & country" }, { value: "tag=apple & episodeCount" }, { value: "tag=apple & episodeDuration" }, { value: "tag=apple & finishedAiringAt" }]],
        ['title', , [{ value: "title~" }]],
        ['title ', , [{ value: "title & " }, { value: "title | " }, { value: "title~" }]],
        ['title ~str', , []],
        ['title~str', , []],
        ['title~str & ', 'title~str '.length, []],
        ['title~str part2', , []],
        ['tag[', , [{ value: "tag[1]" }, { value: "tag[2]" }]],
        ['(tag=hat & tag=rat)', , [{ value: '(tag=hat & tag=rat) & ' }, { value: '(tag=hat & tag=rat) | ' }]],
        ['(tag=hat & tag=rat) ', , [{ value: '(tag=hat & tag=rat) & ' }, { value: '(tag=hat & tag=rat) | ' }]],
    ])('%s should return expected options', (inputText, cursor, expected) => {
        const tags = ['apple', 'banana', 'apple 2'];
        const users = [{ id: 1, email: 'user1@domain.ca' }, { id: 2, email: 'user2@domain.ca' }]
        // don't care about titles
        const actual = filterTextToOptions(inputText, cursor ?? inputText.length, { tags, users }).map((opt) => ({
            value: opt.value,
            pos: opt.pos,
        }));

        expect(actual).toEqual(expected.map((opt) => ({ pos: opt.value.length, ...opt })));
    })
})