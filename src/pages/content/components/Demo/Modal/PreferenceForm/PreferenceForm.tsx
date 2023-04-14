import { Tag } from '@deliveryhero/pd-cookbook/components/Tag';
import { Slider } from '@deliveryhero/pd-cookbook/components/Slider';
import { Dropdown, DropdownOptionType } from '@deliveryhero/pd-cookbook/components/Dropdown';
import { Dispatch, SetStateAction } from 'react';
import { Box } from '@deliveryhero/pd-cookbook/components/Box';

interface Cuisine {
    id: number
    title: string
    url_key?: string
}

interface Props {
    cuisinesDropDownValue: DropdownOptionType[]
    setPriceLimit: Dispatch<SetStateAction<string>>
    setSelectedCuisines: Dispatch<SetStateAction<Cuisine[]>>
    selectedCuisines: Cuisine[]
}

const PreferenceForm: React.FC<Props> = ({
    cuisinesDropDownValue,
    setPriceLimit,
    setSelectedCuisines,
    selectedCuisines,
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
                onChange={(detail) => setPriceLimit(detail.target.value)}
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