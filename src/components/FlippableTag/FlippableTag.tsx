import React, { ReactElement } from 'react';

import { Add } from '@mui/icons-material';
import { Chip, ChipProps } from '@mui/material';

interface FlippableTagProps extends Omit<ChipProps, 'id'> {
    name: string;
    isDeletable?: boolean;
    onFlip: (name: string) => void;
    createdByCurrentUser?: boolean;
    hide?: boolean;
    isEditable: boolean;
}

function FlippableTag(props: FlippableTagProps) {
    const {
        name,
        isDeletable,
        onDelete: onDeleteProp,
        onFlip,
        createdByCurrentUser,
        isEditable,
        ...rest
    } = props;

    const handleFlip = () => {
        onFlip(name)
    }

    const variant: ChipProps['variant'] = createdByCurrentUser ? 'filled' : 'outlined';
    const clickable = !createdByCurrentUser && isEditable;
    let icon: ReactElement | undefined = undefined;
    const onDelete = createdByCurrentUser ? onDeleteProp : handleFlip;

    if (!createdByCurrentUser && isEditable) {
        icon = <Add />;
    }

    return (
        <Chip
            variant={variant}
            {...rest}
            label={name}
            clickable={clickable}
            onClick={handleFlip}
            onDelete={isEditable ? onDelete : undefined}
            deleteIcon={icon}
        />
    )

}

export { FlippableTag };
export type { FlippableTagProps };
