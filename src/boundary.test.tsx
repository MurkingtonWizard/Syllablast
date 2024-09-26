import { expect, test } from 'vitest'
import { render, fireEvent, cleanup } from '@testing-library/react'

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
  const { getByTestId, getAllByTestId } = render(<Home />);
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

  cleanup()
});
