import React from 'react';

interface CategorySelectProps {
    categories: {
        id: string;
        name: string;
    }[];
    onSelectCategory: (id: string) => void;
}

function CategorySelect(props: CategorySelectProps) {
    return (
        <div>CategorySelect</div>
    );
}

export { CategorySelect };
export type { CategorySelectProps };
