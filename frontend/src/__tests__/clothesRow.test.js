import React from 'react';
import { render } from '@testing-library/react-native';
import Home from '../app/(tabs)/HomeScreen';

//mock inventory items

const mockItems = [
    {
        id: '1',
        mainImage: '@assets/images/2.png',
        onSale: true,
        salePrice: '50',
        isFavourited: false,
        isAddedToCart: false,
    },
    {
        id: '2',
        mainImage: '@assets/images/2.png',
        onSale: false,
        salePrice: '150',
        isFavourited: false,
        isAddedToCart: false,
    }
];

describe(' Home Page', () => {
    it('renders the  "recommended for you" row component', () => {
        const { getByText, getAllByTestID } = render (
            <Home />
        );

        //check header rendering
        expect (getByText('Recommended for you')).toBeTruthy();

        const items = getAllByTestID('clothes-items');
        expect(items.length).toBe(mockItems.length)
    });
})