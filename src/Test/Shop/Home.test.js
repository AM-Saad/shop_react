import { screen, render, cleanup } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import Categories from '../../components/Shop/Category/Categories'
import MainProducts from '../../components/Shop/MainProducts/MainProducts'



const MockProducts = () => {
    <BrowserRouter>
        <MainProducts />
    </BrowserRouter>
}


describe('Products Ui', () => {

    afterAll(() => {
        cleanup();
    });


    it('should display "Products" if list was loaded', async () => {
        // Arrange
        render(<MockProducts />)

        // Act

        // Assert
        const listItemElements = await screen.findAllByTestId('products');
        expect(listItemElements).not.toHaveLength(0)

    })

    // it('Check if Alert role exist and the list was not loaded', async () => {
    //     // Arrange
    //     render(<Categories />)

    //     // Act

    //     // Assert
    //     const listItemElements = await screen.findByText('Please check your connection', { exact: false })
    //     expect(listItemElements).toBeInTheDocument()


    // })



})

describe('Categories Ui', () => {

    afterAll(() => {
        cleanup();
    });


    it('should display "Categories" if list was loaded', async () => {
        // Arrange
        render(<Categories />)

        // Act

        // Assert
        const listItemElements = await screen.findAllByRole('listitem', {}, { timeout: 3000 });
        expect(listItemElements).not.toHaveLength(0)

    })

    // it('Check if Alert role exist and the list was not loaded', async () => {
    //     // Arrange
    //     render(<Categories />)

    //     // Act

    //     // Assert
    //     const listItemElements = await screen.findByText('Please check your connection', { exact: false })
    //     expect(listItemElements).toBeInTheDocument()


    // })

})



