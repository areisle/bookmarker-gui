import { TextField, Button, CircularProgress, Typography, Stack, Skeleton, MenuItem, Box } from '@mui/material';
import { uniq } from 'lodash';
import React, { ChangeEvent, isValidElement, ReactNode, useEffect, useState } from 'react';
import { AddDramaVariables, CreateDramaContent, Drama, Link, RemoveDramaVariables, UpdateDramaVariables } from '../../queries';
import { ConfirmButton } from '../ConfirmButton';
import { RelativeDate } from '../RelativeDate';
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

interface PartialDrama extends Omit<Partial<Drama>, 'links'> {
    links?: (Partial<Link> | Link)[];
}

const formatForEdit = (drama: PartialDrama | Drama | undefined) => {
    const next = {
        groupedTags: [],
        ...drama as PartialDrama ?? {},
        title: drama?.title ?? '',
        status: drama?.status ?? '',
        description: drama?.description ?? '',
        links: (drama?.links?.map((link) => `${link.url}\n`).join('') ?? ''),
        finishedAiringAt: drama?.finishedAiringAt?.split('T')[0] ?? null,
        startedAiringAt: drama?.startedAiringAt?.split('T')[0] ?? null,
        watched: drama?.currentUserWatched,
    };
    return next;
}

const formatForSubmit = (nextDrama: ReturnType<typeof formatForEdit>): CreateDramaContent => {
    const nextTags: string[] = [];
    nextDrama.groupedTags?.forEach((tag) => {
        if (tag.current) {
            nextTags.push(tag.name);
        }
    });

    return {
        title: nextDrama.title,
        links: nextDrama.links.trim().split(/[\s\n]+/).filter(Boolean),
        description: nextDrama.description,
        tags: nextTags,
        status: nextDrama.status,
        watched: nextDrama.watched ?? '',
        finishedAiringAt: nextDrama.finishedAiringAt,
        country: nextDrama.country,
        episodeCount: nextDrama.episodeCount,
        episodeDuration: nextDrama.episodeDuration,
    }
}

interface DramaEditorProps {
    drama: PartialDrama | Drama | undefined;
    /**
     * loading data necessary to display editor etc.
     */
    isLoading?: boolean;
    /**
     * adding/updating of drama is in progress
     */
    isProcessing?: boolean;
    /**
     * deleting of drama is in progress
     */
    isDeleting?: boolean;
    /**
     * error adding/updating/deleting drama
     */
    error?: Error | null | undefined;
    onAdd?: (variables: AddDramaVariables) => void;
    onDelete: (variables: RemoveDramaVariables) => void;
    onUpdate: (variables: UpdateDramaVariables) => void;
}

function DramaEditor(props: DramaEditorProps) {
    const {
        drama,
        isLoading,
        isProcessing,
        isDeleting,
        error,
        onAdd,
        onUpdate,
        onDelete,
    } = props;

    const dramaId = drama?.id;
    const isNew = !dramaId;

    const isDisabled = isLoading || isProcessing || isDeleting;

    const [nextDrama, setNextDrama] = useState(formatForEdit(drama));

    useEffect(() => {
        setNextDrama(formatForEdit(drama));
    }, [drama]);


    const handleAddDrama = () => {
        onAdd?.({
            input: formatForSubmit(nextDrama)
        });
    }

    const handleUpdateDrama = () => {
        if (!dramaId) {
            return;
        }

        onUpdate?.({
            id: dramaId,
            input: formatForSubmit(nextDrama)
        });
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNextDrama((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    const handleChangeNumber = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNextDrama((prev) => ({
            ...prev,
            [e.target.name]: e.target.value ? Math.round(Number(e.target.value)) : null
        }))
    }

    const handleChangeTags = (nextTags: Drama['groupedTags']) => {
        setNextDrama((prev) => ({
            ...prev,
            groupedTags: nextTags,
        }))
    }

    return (
        <Stack spacing={1.5} alignItems='start'>
            <LoadingSkeleton
                isLoading={isLoading}
                width='100%'
            >
                <TextField
                    label='Title'
                    value={nextDrama.title ?? ''}
                    disabled={isDisabled}
                    name='title'
                    onChange={handleChange}
                    required={true}
                    fullWidth={true}
                />
                <TextField
                    label='links'
                    disabled={isDisabled}
                    name='links'
                    value={nextDrama.links ?? ''}
                    multiline={true}
                    required={true}
                    onChange={handleChange}
                    fullWidth={true}
                    spellCheck={false}
                />
                <TextField
                    label='Status'
                    value={nextDrama.status ?? ''}
                    disabled={isDisabled}
                    name='status'
                    onChange={handleChange}
                    required={true}
                    fullWidth={true}
                    select={true}
                >
                    <MenuItem value="Upcoming">Upcoming</MenuItem>
                    <MenuItem value="Ongoing">Ongoing</MenuItem>
                    <MenuItem value="Completed - Missing Subs">Completed - Missing Subs</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                </TextField>
                <TextField
                    label='Watched'
                    value={nextDrama.watched ?? ''}
                    disabled={isDisabled}
                    name='watched'
                    onChange={handleChange}
                    fullWidth={true}
                    select={true}
                >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                    <MenuItem value="maybe">Maybe</MenuItem>
                    <MenuItem value="dropped">Dropped</MenuItem>
                </TextField>
                <Box sx={{ display: 'flex', gap: '10px' }}>
                    <TextField
                        name='startedAiringAt'
                        label='Started Airing'
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        value={nextDrama.startedAiringAt ?? ''}
                        type='date'
                    />
                    <TextField
                        name='finishedAiringAt'
                        label='Finished Airing'
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        value={nextDrama.finishedAiringAt ?? ''}
                        type='date'
                    />
                </Box>
                <TextField
                    label='Country'
                    value={nextDrama.country ?? ''}
                    disabled={isDisabled}
                    name='country'
                    onChange={handleChange}
                    fullWidth={true}
                    select={true}
                >
                    <MenuItem value="China">China</MenuItem>
                    <MenuItem value="South Korea">South Korea</MenuItem>
                    <MenuItem value="Japan">Japan</MenuItem>
                    <MenuItem value="Taiwan">Taiwan</MenuItem>
                    <MenuItem value="Thailand">Thailand</MenuItem>
                    <MenuItem value="Hong Kong">Hong Kong</MenuItem>
                    <MenuItem value="Philippines">Philippines</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                </TextField>
                <Box sx={{ display: 'flex', gap: '10px' }}>
                    <TextField
                        name='episodeCount'
                        label='Episode Count'
                        value={nextDrama.episodeCount ?? ''}
                        type='number'
                        onChange={handleChangeNumber}
                    />
                    <TextField
                        name='episodeDuration'
                        label='Episode Duration (min.)'
                        value={nextDrama.episodeDuration ?? ''}
                        type='number'
                        onChange={handleChangeNumber}
                    />
                </Box>
                <TextField
                    label='Description'
                    name='description'
                    value={nextDrama.description ?? ''}
                    multiline={true}
                    disabled={isDisabled}
                    onChange={handleChange}
                    fullWidth={true}
                />
                <TagsEditor
                    disabled={isDisabled}
                    value={nextDrama.groupedTags}
                    onChange={handleChangeTags}
                />
            </LoadingSkeleton>
            {error && (
                <Typography color='error'>
                    {error.message}
                </Typography>
            )}
            <Button
                onClick={isNew ? handleAddDrama : handleUpdateDrama}
                disabled={isDisabled}
                variant='contained'
                endIcon={(isProcessing) ? <CircularProgress color="inherit" size={20} /> : null}
            >
                {isNew ? 'Add' : 'Update'} Drama
            </Button>
            {!isNew && (
                <Typography variant='caption'>
                    Created <RelativeDate>{nextDrama.createdAt}</RelativeDate> (by {nextDrama.createdBy?.email}). Last modified <RelativeDate>{nextDrama.lastModifiedAt}</RelativeDate> (by {nextDrama.lastModifiedBy?.email}).
                </Typography>
            )}
            {!isNew && (
                <ConfirmButton
                    confirmText='Confirm delete drama?'
                    onClick={() => onDelete?.({ id: dramaId })}
                    disabled={isDisabled}
                    color='error'
                    endIcon={isDeleting ? <CircularProgress color="inherit" size={20} /> : null}
                >
                    Remove Drama
                </ConfirmButton>
            )}
        </Stack>
    );
}

export { DramaEditor };
