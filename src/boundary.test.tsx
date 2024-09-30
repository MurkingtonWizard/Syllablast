import { expect, test } from 'vitest'
import { render, fireEvent, cleanup, getByText } from '@testing-library/react'

import Home from './app/page'

// to write this kind of test, we need to be able to render canvas, so we need 
// to simply run (once) npm install canvas. Tricky for GUI but these have to 
// be async functions that are cleaned up afterwards. Only for REACT gui
test('Home', async () => {
    //expect(true).toBe(true)
  const { getByText } = render(<Home />)
  const swapsElement = getByText(/Swaps: 0/i);
    const scoreElement = getByText(/Score: 0/i);
    const victoryElement = getByText(/You Win!/i);

  expect(swapsElement === undefined).toBe(false)
  expect(scoreElement === undefined).toBe(false)
  expect(victoryElement === undefined).toBe(false)
 
  cleanup()
})

test('Access GUI', async() => {
  const { getByTestId, getAllByTestId, getByText } = render(<Home />);
  //expect(true).toBe(true)
  const config1 = getByTestId('config1') as HTMLButtonElement
  const config2 = getByTestId('config2') as HTMLButtonElement
  const config3 = getByTestId('config3') as HTMLButtonElement
  
  // initially, this button
  expect(config1.disabled).toBeTruthy()
  expect(config2.disabled).toBeFalsy()
  expect(config3.disabled).toBeFalsy()

  const reset = getByTestId('reset') as HTMLButtonElement
  const undo = getByTestId('undo') as HTMLButtonElement
  const swap = getByTestId('swap') as HTMLButtonElement
    
  expect(reset.disabled).toBeTruthy()
  expect(undo.disabled).toBeTruthy()
  expect(swap.disabled).toBeTruthy()

  const gridButtons = getAllByTestId(/button-\d+,\d+/) as HTMLButtonElement[];
  
  expect(gridButtons.length).toBe(16);

  fireEvent.click(gridButtons[0])
  expect(gridButtons[0].disabled).toBeFalsy();
  expect(reset.disabled).toBeTruthy()
  expect(undo.disabled).toBeTruthy()
  expect(swap.disabled).toBeTruthy()

  fireEvent.click(gridButtons[0])
  expect(gridButtons[0].disabled).toBeFalsy();
  expect(reset.disabled).toBeTruthy()
  expect(undo.disabled).toBeTruthy()
  expect(swap.disabled).toBeTruthy()
  
  fireEvent.click(gridButtons[0])
  fireEvent.click(gridButtons[1])
  expect(gridButtons[1].disabled).toBeFalsy();
  expect(reset.disabled).toBeTruthy()
  expect(undo.disabled).toBeTruthy()
  expect(swap.disabled).toBeFalsy()

  fireEvent.click(swap)
  expect(reset.disabled).toBeFalsy()
  expect(undo.disabled).toBeFalsy()
  expect(swap.disabled).toBeTruthy()

  fireEvent.click(undo)
  expect(reset.disabled).toBeTruthy()
  expect(undo.disabled).toBeTruthy()
  expect(swap.disabled).toBeTruthy()

  fireEvent.click(gridButtons[0])
  fireEvent.click(gridButtons[1])
  fireEvent.click(swap)
  fireEvent.click(gridButtons[2])
  fireEvent.click(gridButtons[3])
  fireEvent.click(swap)
  fireEvent.click(reset)
  expect(reset.disabled).toBeTruthy()
  expect(undo.disabled).toBeTruthy()
  expect(swap.disabled).toBeTruthy()

  fireEvent.click(config2)
  expect(config1.disabled).toBeFalsy()
  expect(config2.disabled).toBeTruthy()
  expect(config3.disabled).toBeFalsy()

  fireEvent.click(config3)
  expect(config1.disabled).toBeFalsy()
  expect(config2.disabled).toBeFalsy()
  expect(config3.disabled).toBeTruthy()

  fireEvent.click(config1)
  expect(config1.disabled).toBeTruthy()
  expect(config2.disabled).toBeFalsy()
  expect(config3.disabled).toBeFalsy()

  cleanup()
});


test('Full configuration', async() => {
    const { getByTestId, getByText } = render(<Home />);
    const config1 = getByTestId('config1') as HTMLButtonElement
    const swap = getByTestId('swap') as HTMLButtonElement
    const reset = getByTestId('reset') as HTMLButtonElement
    const undo = getByTestId('undo') as HTMLButtonElement

  // full solution for config 1
  fireEvent.click(config1)
  const scoreElement = getByText(/Score: \d+/);
  const victoryElement = getByText(/You Win!/);
  expect(scoreElement === undefined).toBe(false);
  expect(victoryElement === undefined).toBe(false);
  expect(victoryElement.style.visibility).toStrictEqual('hidden')

  const swapPair = (row1:number,col1:number,row2:number,col2:number) => {
    fireEvent.click(getByTestId(`button-${row1},${col1}`) as HTMLButtonElement);
    fireEvent.click(getByTestId(`button-${row2},${col2}`) as HTMLButtonElement);
    fireEvent.click(swap);
  }

  swapPair(1,1,3,0)
  swapPair(2,0,3,2)
  swapPair(0,2,3,3)
  expect(scoreElement.textContent).toStrictEqual("Score: 5");

  swapPair(1,0,2,1)
  swapPair(1,3,2,2)
  swapPair(0,1,2,3)
  expect(scoreElement.textContent).toStrictEqual("Score: 8");

  swapPair(0,0,0,3)
  swapPair(0,0,0,1)
  expect(scoreElement.textContent).toStrictEqual("Score: 12");

  swapPair(1,0,1,2)
  expect(scoreElement.textContent).toStrictEqual("Score: 13");
  
  swapPair(1,1,1,3)
  swapPair(1,2,1,3)
  expect(scoreElement.textContent).toStrictEqual("Score: 16");
  
  expect(victoryElement.style.visibility).toBeTruthy()
  expect(swap.disabled).toBeTruthy()
  expect(undo.disabled).toBeTruthy()
  expect(reset.disabled).toBeFalsy()

  cleanup()
});