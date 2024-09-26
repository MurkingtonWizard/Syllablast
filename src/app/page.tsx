'use client'
import React from 'react'
import {Coordinate, Swap, Model} from '../model'
import {configuration1,configuration2,configuration3} from '../puzzle'


// Controllers 
export function selectSyllable(m:Model, row:number, col:number) {
  let coord = Coordinate.key(row,col);
  if(m.puzzle.selectedSyllables.has(coord)) {
      m.puzzle.selectedSyllables.delete(coord)
  } else if(m.puzzle.selectedSyllables.size < 2) {
      m.puzzle.selectedSyllables.add(coord);
  }
}

export function swapSyllables(m:Model) {
  if(m.canSwap()) {
    var select1 = Array.from(m.puzzle.selectedSyllables)[0];
    var select2 = Array.from(m.puzzle.selectedSyllables)[1];
    m.puzzle.switchSyllables(select1,select2);

    m.puzzle.swaps.push(new Swap(Coordinate.coordinate(select1),
        Coordinate.coordinate(select2)));

    m.puzzle.selectedSyllables.clear();
  }
}

export function undoSwap(m:Model) {
  if(m.canUndo()) {
    var swap = m.puzzle.swaps.pop()!;
    m.puzzle.switchSyllables(swap.syllables[0].key, swap.syllables[1].key);
    //does undo deselect?
  }
}

export function resetGame(m:Model) {
  while(m.canUndo()) {
    undoSwap(m)
  }
  // deselect?
}

export function openConfiguration(m:Model, configuration:any) {
  m.initialize(configuration);
}

export default function Home() {

  const [model,setModel] = React.useState (new Model(configuration1))
  const [redraw, setRedraw] = React.useState(0);

  React.useEffect (() => {}, [model, redraw])

  const select = (row:number, col:number) => {
    selectSyllable(model,row,col)
    setRedraw(redraw + 1)
  }

  const swap = () => {
    swapSyllables(model);
    setRedraw(redraw + 1)
  }

  const undo = () => {
    undoSwap(model);
    setRedraw(redraw+1)
  }

  const reset = () => {
    resetGame(model);
    setRedraw(redraw+1)
  }

  const openConfig = (config: any) => {
    openConfiguration(model,config);
    setRedraw(redraw+1)
  }

  // boundary
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-400">
      <div className="content-wrapper flex">
        <div className='config-col'>
          <div className='configurations'>
            <button data-testid='config1' className="configuration" disabled={model.configuration === configuration1.name}
                onClick={() => openConfig(configuration1)}>Configuration 1
            </button>
            <button data-testid='config2' className="configuration" disabled={model.configuration === configuration2.name}
                onClick={() => openConfig(configuration2)}>Configuration 2</button>
            <button data-testid='config3' className="configuration" disabled={model.configuration === configuration3.name}
                onClick={() => openConfig(configuration3)}>Configuration 3</button>
          </div>
        </div>
        <div className="game-content flex flex-col items-center">
          <label className={`game-over`}
          style={{
            visibility: `${model.victory ? 'visible' : 'hidden'}`,
          }}>You Win!</label>
          <div className="labels">
            <label className='game-info'>Swaps: {model.numSwaps}</label>
            <label className='game-info'>Score: {model.score}</label>
          </div>
          <div className="grid"
          style={{
            gridTemplateColumns: `repeat(${model.puzzle.numSyllablesInWord}, 1fr)`,
          }}>
            {Array.from({ length: model.puzzle.numWords }).map((_: any, row: any) => (
              Array.from({ length: model.puzzle.numSyllablesInWord }).map((_, col) => {
                const isSelected = model.puzzle.selectedSyllables.has(Coordinate.key(row, col));
                return (
                  <button
                    data-testid={`button-${row},${col}`}
                    key={`${Coordinate.key(row, col)}`}
                    onClick={() => select(row, col)}
                    disabled={model.victory}
                    className={`button ${isSelected ? 'selected' : ''}`}
                  >
                    {model.puzzle.syllables.get(Coordinate.key(row, col))}
                  </button>
                );
              })
            ))}
          </div>
          <div className="game-buttons flex justify-center">
            <button className='game-button'
                data-testid='reset'
                disabled={!model.canUndo()}
                onClick={() => reset()}>Reset</button>
            <button className='game-button'
                data-testid='undo'
                disabled={!model.canUndo() || model.victory}
                onClick={() => undo()}>Undo</button>
            <button className='game-button'
                data-testid='swap'
                disabled={!model.canSwap() || model.victory}
                onClick={() => swap()}>Swap</button>
          </div>
        </div>
      </div>
    </main>

  );
}
  