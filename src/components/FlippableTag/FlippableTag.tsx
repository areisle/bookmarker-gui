import React, { ReactElement } from 'react';

import { Add } from '@mui/icons-material';
import { Chip, ChipProps } from '@mui/material';

interface FlippableTagProps extends Omit<ChipProps, 'id'> {
    name: string;
    isDeletable?: boolean;
    onFlip: (name: string) => void;
    createdByCurrentUser?: number;
    hide?: boolean;
    isEditable: boolean;
    count?: number;
}

function FlippableTag(props: FlippableTagProps) {
    const {
        name,
        isDeletable,
        onDelete: onDeleteProp,
        onFlip,
        createdByCurrentUser,
        isEditable,
        count = 0,
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
            label={count > 1 ? `${name} (${count})` : name}
            clickable={clickable}
            onClick={handleFlip}
            onDelete={isEditable ? onDelete : undefined}
            deleteIcon={icon}
        />
    )

}

export { FlippableTag };
export type { FlippableTagProps };
