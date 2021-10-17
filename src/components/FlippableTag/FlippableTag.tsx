import React, { ReactElement } from 'react';

import { Add } from '@mui/icons-material';
import { Chip, ChipProps } from '@mui/material';

interface FlippableTagProps extends Omit<ChipProps, 'id'> {
    name: string;
    isDeletable?: boolean;
    onFlip: (name: string) => void;
    createdByCurrentUser?: boolean;
    hide?: boolean;
}

function FlippableTag(props: FlippableTagProps) {
    const {
        name,
        isDeletable,
        onDelete: onDeleteProp,
        onFlip,
        createdByCurrentUser,
        ...rest
    } = props;

    const handleFlip = () => {
        onFlip(name)
    }

    const variant: ChipProps['variant'] = createdByCurrentUser ? 'filled' : 'outlined';
    const clickable = !createdByCurrentUser;
    let icon: ReactElement | undefined = undefined;
    const onDelete = createdByCurrentUser ? onDeleteProp : handleFlip;

    if (!createdByCurrentUser) {
        icon = <Add />;
    }

    return (
        <Chip
            variant={variant}
            {...rest}
            label={name}
            clickable={clickable}
            onClick={handleFlip}
            onDelete={onDelete}
            deleteIcon={icon}
        />
    )

}

export { FlippableTag };
export type { FlippableTagProps };
