import { Tag } from '@deliveryhero/pd-cookbook/components/Tag';
import { Slider } from '@deliveryhero/pd-cookbook/components/Slider';
import { Dropdown, DropdownOptionType } from '@deliveryhero/pd-cookbook/components/Dropdown';
import { Dispatch, SetStateAction } from 'react';
import { Box } from '@deliveryhero/pd-cookbook/components/Box';
import { TextInput } from '@deliveryhero/pd-cookbook/components/TextInput';

interface Cuisine {
    id: number
    title: string
    url_key?: string
}

interface Props {
    cuisinesDropDownValue: DropdownOptionType[]
    setPriceLimit: Dispatch<SetStateAction<number>>
    setDeliveryTime: Dispatch<SetStateAction<number>>
    setSelectedCuisines: Dispatch<SetStateAction<Cuisine[]>>
    selectedCuisines: Cuisine[]
    priceLimit: number
    deliveryTime: number
}

const PreferenceForm: React.FC<Props> = ({
    cuisinesDropDownValue,
    setPriceLimit,
    setSelectedCuisines,
    setDeliveryTime,
    selectedCuisines,
    priceLimit,
    deliveryTime,
}) => {
    return (
        <>
            <Slider
                boxClassName=""
                id="price-limit"
                inputClassName=""
                label="Price limit"
                labelLeft="$15"
                labelRight="$30"
                max={40}
                min={20}
                required
                step={1}
                tooltipText=""
                value={priceLimit}
                onChange={(detail) => setPriceLimit(parseInt(detail.target.value))}
            />
            <Slider
                boxClassName=""
                id="delivery-time-limit"
                inputClassName=""
                label="Maximum Delivery Time"
                labelLeft="25 mins"
                labelRight="60 mins"
                max={60}
                min={25}
                required
                step={1}
                tooltipText=""
                value={deliveryTime}
                onChange={(detail) => setDeliveryTime(parseInt(detail.target.value))}
            />

            <Dropdown
                id="test"
                onChange={(detail) => setSelectedCuisines(prevCuisines => [...prevCuisines, {
                    id: parseInt(detail.value) ?? 0,
                    title: detail.label ?? '',
                    url_key: '',
                }])}
                options={cuisinesDropDownValue}
                zIndex={10}
            />
            <Box direction="row">
                {selectedCuisines.map((cuisine) => (
                    <Tag id={cuisine.id.toString()} label={cuisine.title} />
                ))}
            </Box>
        </>
    );
};

export { PreferenceForm }