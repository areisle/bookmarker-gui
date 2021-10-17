import { TextField, Button, CircularProgress, Typography, Stack, Skeleton } from '@mui/material';
import { uniq } from 'lodash';
import React, { ChangeEvent, isValidElement, ReactNode, useEffect, useState } from 'react';
import { AddBookmarkVariables, BookmarksForUrl, RemoveBookmarkVariables, UpdateBookmarkVariables } from '../../queries';
import { AliasesEditor } from '../AliasesEditor';
import { ConfirmButton } from '../ConfirmButton';
import { TagsEditor } from '../TagsEditor';

interface LoadingSkeletonProps {
    isLoading: boolean | undefined;
    children: ReactNode;
    width?: string | number;
}

function LoadingSkeleton(props: LoadingSkeletonProps) {
    const { isLoading, children, width } = props

    if (isLoading) {

        return (
            <>
                {React.Children.map(children, (child) => {
                    let sWidth = width
                    if (isValidElement(child)) {
                        console.log(child.props)
                        sWidth = child.props.fullWidth ? '100%' : width
                    }
                    return (
                        <Skeleton width={sWidth}>{child}</Skeleton>
                    )
                })}
            </>
        )
    }

    return (
        <>{children}</>
    )
}

type Bookmark = BookmarksForUrl['bookmarksForUrl'][number];

interface BookmarkEditorProps {
    bookmark: Partial<Bookmark>;
    /**
     * loading data necessary to display editor etc.
     */
    isLoading?: boolean;
    /**
     * adding/updating of bookmark is in progress
     */
    isProcessing?: boolean;
    /**
     * deleting of bookmark is in progress
     */
    isDeleting?: boolean;
    /**
     * error adding/updating/deleting bookmark
     */
    error?: Error | null | undefined;
    onAdd?: (variables: AddBookmarkVariables) => void;
    onDelete: (variables: RemoveBookmarkVariables) => void;
    onUpdate: (variables: UpdateBookmarkVariables) => void;
}

function BookmarkEditor(props: BookmarkEditorProps) {
    const {
        bookmark,
        isLoading,
        isProcessing,
        isDeleting,
        error,
        onAdd,
        onUpdate,
        onDelete,
    } = props;

    const bookmarkId = bookmark?.id;
    const categoryId = bookmark?.category?.id;
    const isNew = !bookmarkId;

    const isDisabled = isLoading || isProcessing || isDeleting;

    const [nextBookmark, setNextBookmark] = useState({ ...bookmark });

    useEffect(() => {
        setNextBookmark(bookmark);
    }, [bookmark]);


    const handleAddBookmark = () => {
        if (!categoryId || !nextBookmark.title || !nextBookmark.url) {
            return;
        }
        onAdd?.({
            input: {
                title: nextBookmark.title ?? '',
                url: nextBookmark.url ?? '',
                categoryId,
                description: nextBookmark.description,
                tags: uniq(nextBookmark.tags?.map((tag) => tag.name))
            }
        });
    }

    const handleUpdateBookmark = () => {
        if (!bookmarkId || !nextBookmark.title || !nextBookmark.url) {
            return;
        }

        const nextTags: string[] = [];
        nextBookmark.tags?.forEach((tag) => {
            if (tag.createdByCurrentUser) {
                nextTags.push(tag.name);
            }
        });

        onUpdate?.({
            id: bookmarkId,
            input: {
                title: nextBookmark.title ?? '',
                url: nextBookmark.url ?? '',
                description: nextBookmark.description,
                tags: uniq(nextTags),
                aliases: nextBookmark.aliases?.map((alias) => alias.url)
            }
        });
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNextBookmark((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleChangeTags = (nextTags: Bookmark['tags']) => {
        setNextBookmark((prev) => ({
            ...prev,
            tags: nextTags,
        }))
    }

    const handleChangeAliases = (nextAliases: Bookmark['aliases']) => {
        setNextBookmark((prev) => ({
            ...prev,
            aliases: nextAliases,
        }))
    }

    return (
        <Stack spacing={1.5} alignItems='start'>
            <LoadingSkeleton
                isLoading={isLoading || !categoryId}
                width='100%'
            >
                <TextField
                    label='Title'
                    value={nextBookmark?.title ?? ''}
                    disabled={isDisabled}
                    name='title'
                    onChange={handleChange}
                    required={true}
                    fullWidth={true}
                />
                <TextField
                    label='Canonical Url'
                    value={nextBookmark?.url ?? ''}
                    name='url'
                    disabled={true}
                    required={true}
                    onChange={handleChange}
                    fullWidth={true}
                />
                <TextField
                    label='Description'
                    name='description'
                    value={nextBookmark?.description ?? ''}
                    multiline={true}
                    disabled={isDisabled}
                    onChange={handleChange}
                    onBlur={console.log}
                    fullWidth={true}
                />
                <TagsEditor
                    categoryId={categoryId}
                    disabled={isDisabled}
                    value={nextBookmark.tags}
                    onChange={handleChangeTags}
                />
                {bookmarkId && (
                    <AliasesEditor
                        aliases={nextBookmark.aliases}
                        onChange={handleChangeAliases}
                    />
                )}
            </LoadingSkeleton>
            {error && (
                <Typography color='error'>
                    {error.message}
                </Typography>
            )}
            <Button
                onClick={isNew ? handleAddBookmark : handleUpdateBookmark}
                disabled={isDisabled}
                endIcon={(isProcessing) ? <CircularProgress color="inherit" size={20} /> : null}
            >
                {isNew ? 'Add' : 'Update'} Bookmark
            </Button>
            {!isNew && (
                <ConfirmButton
                    confirmText='Confirm delete bookmark?'
                    onClick={() => onDelete?.({ id: bookmarkId })}
                    disabled={isDisabled}
                    color='error'
                    endIcon={isDeleting ? <CircularProgress color="inherit" size={20} /> : null}
                >
                    Remove Bookmark
                </ConfirmButton>
            )}
        </Stack>
    );
}

export { BookmarkEditor };
export type { BookmarkEditorProps };
