import { Tag } from '@deliveryhero/pd-cookbook/components/Tag';
import { Slider } from '@deliveryhero/pd-cookbook/components/Slider';
import { Dropdown, DropdownOptionType } from '@deliveryhero/pd-cookbook/components/Dropdown';
import { Dispatch, SetStateAction } from 'react';
import { Box } from '@deliveryhero/pd-cookbook/components/Box';
import { Pill } from '@deliveryhero/pd-cookbook/components/Pill';
import Typography from '@deliveryhero/pd-cookbook/components/Typography';

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

const dealBreakers = [
    {
        id: 108,
        label: 'Halal',
    },
    {
        id: 58,
        label: 'Vegetarian',
    },
]

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
                value={30}
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

            <Box marginTop="md">
                <Typography as="p" type="label-md">
                    Deal-breakers
                </Typography>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginTop: '1rem',
                }}>
                    {dealBreakers.map(dealBreaker => (
                        <Pill
                            id={dealBreaker.id.toString()}
                            label={dealBreaker.label}
                            checked={selectedCuisines.map(cuisine => cuisine.id).includes(dealBreaker.id)}
                            onChange={() => {
                                if (!selectedCuisines.map(cuisine => cuisine.id).includes(dealBreaker.id)) {
                                    setSelectedCuisines(prevState => [...prevState, {
                                        id: dealBreaker.id,
                                        title: dealBreaker.label,
                                    }]);
                                } else {
                                    const filteredCuisines = selectedCuisines.filter(cuisine => cuisine.id !== dealBreaker.id)
                                    setSelectedCuisines(filteredCuisines);
                                }
                            }}
                        />
                    ))}
                </div>
            </Box>
        </>
    );
};

export { PreferenceForm }