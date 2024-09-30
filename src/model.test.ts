import { expect, test } from 'vitest'
import { Coordinate, Swap, Puzzle, Model } from './model'
import { configuration1, configuration2, configuration3 } from './puzzle'
import exp from 'constants'

test('Coordinate', () => {
    let c1 = new Coordinate(2, 3)
    expect(c1.key).toBe("2,3")
    expect(c1.row).toBe(2)
    expect(c1.column).toBe(3)
    expect(c1).toStrictEqual(new Coordinate(2,3))
    expect(Coordinate.key(0,0)).toBe("0,0");
    expect(Coordinate.coordinate("1,2")).toStrictEqual(new Coordinate(1,2));
})

test('Swap', () => {
    let swap = new Swap(new Coordinate(0,0),new Coordinate(0,1))
    expect(swap.syllables.length).toBe(2)
    expect(swap.syllables[0]).toStrictEqual(new Coordinate(0,0));
    expect(swap.syllables[1]).toStrictEqual(new Coordinate(0,1));

})

test('Puzzle', () => {
    let words = new Map<String,String>([
        [Coordinate.key(0,0),"test"],
        [Coordinate.key(0,1),"ing"],
        [Coordinate.key(1,0),"sylla"],
        [Coordinate.key(1,1),"blast"]
    ])
    let syllables = new Map<String,String>([
        [Coordinate.key(0,1),"test"],
        [Coordinate.key(0,0),"ing"],
        [Coordinate.key(1,0),"sylla"],
        [Coordinate.key(1,1),"blast"]
    ])
    expect(words.get(Coordinate.key(0,0))).toBe("test")
    let pz = new Puzzle(syllables,words,2,2)
    expect(pz.syllables).toStrictEqual(syllables)
    expect(pz.selectedSyllables).toStrictEqual(new Set<String>())
    expect(pz.swaps).toStrictEqual([])
    expect(pz.numSyllablesInWord).toBe(2)
    expect(pz.numSyllablesInWord).toBe(2)
    
    expect(pz.calculateScore()).toBe(2)
})

test('Model', () => {
    let m = new Model(configuration1)
    expect(m.puzzle.syllables.size).toBe(16)
    expect(m.numSwaps).toBe(0);
    expect(m.score).toBe(0);
    expect(m.victory).toBe(false)
    expect(m.puzzle.numWords).toBe(4);

    expect(m.canSwap()).toBe(false);
    m.puzzle.selectedSyllables.add(Coordinate.key(0,1));
    expect(m.canSwap()).toBe(false);
    m.puzzle.selectedSyllables.add(Coordinate.key(0,0));
    expect(m.canSwap()).toBe(true);
    
    m.puzzle.switchSyllables(Coordinate.key(0,0),Coordinate.key(0,1));
    expect(m.puzzle.syllables.get("0,0")).toBe("ate")
    expect(m.puzzle.syllables.get("0,1")).toBe("ter")

    expect(m.canUndo()).toBe(false)
    m.puzzle.swaps.push(new Swap(new Coordinate(0,0),new Coordinate(0,1)))
    expect(m.canUndo()).toBe(true)
})