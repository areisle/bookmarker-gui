import { Meta, Story } from "@storybook/react/types-7-0";
import React from "react";
import { DramasFilter } from "./Filter";
import { graphql } from 'msw'
import { FetchTags } from "../../queries";

export default {
    component: DramasFilter,
    parameters: {
        msw: {
            handlerrs: [
                graphql.query('fetchTags', (req, res, ctx) => {
                    const data: FetchTags = {
                        "tags": [
                            { name: "historical" },
                            { name: "liked" },
                            { name: "ends happy" },
                            { name: "time travel" },
                            { name: "funny" },
                            { name: "goes into book/comic" },
                            { name: "didn't like" },
                            { name: "fantasy" },
                            { name: "sad" },
                            { name: "favorite" },
                            { name: "sad ending" },
                            { name: "smart protagonist" },
                        ]
                    }
                    return res(ctx.data(data))
                }),
            ]
        }
    }
} as Meta

type Props = React.ComponentProps<typeof DramasFilter>;

export const Example: Story<Props> = {
    args: {
        value: 'tag=historical'
    }
};