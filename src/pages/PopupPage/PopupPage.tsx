import { Box, Button, Stack, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { DramaEditor } from '../../components';
import { useAddDrama, useAuth, useRemoveDrama, useUpdateDrama, useIsDramaBookmarked, useFetchDramas } from '../../queries';
import { usePageMeta } from '../../queries/ActiveTabProvider';


/**
 * allow user to add/edit/delete drama for active page
 * @returns
 */
function PopupPage() {
    const tab = usePageMeta();

    const { data: dramaId, refetch: refetchIsBookmarked } = useIsDramaBookmarked(
        { url: tab?.url as string },
        { enabled: Boolean(tab?.url), select: (response) => response.isDramaBookmarked }
    );

    const newDrama = useMemo(() => ({
        title: tab?.title,
        links: [{ url: tab?.url }]
    }), [tab]);

    const {
        data: drama,
        isLoading: isLoadingDrama,
        error: errorLoadingDrama,
        refetch,
    } = useFetchDramas(
        { where: { id: dramaId! } },
        {
            enabled: Boolean(dramaId),
            select: (response) => response.dramas.data[0]
        },
    )

    const {
        mutate: addDrama,
        error: errorAdding,
        isLoading: isAdding
    } = useAddDrama({ onSuccess: () => refetchIsBookmarked() });

    const {
        mutate: removeDrama,
        error: errorRemoving,
        isLoading: isRemoving
    } = useRemoveDrama({ onSuccess: () => refetch() });

    const {
        mutate: updateDrama,
        error: errorUpdating,
        isLoading: isUpdating
    } = useUpdateDrama({ onSuccess: () => refetch() });

    const { logout } = useAuth();

    return (
        <Box sx={{ minWidth: '300px', minHeight: '200px' }}>
            <Stack spacing={1.5}>
                <Box
                    display='flex'
                    sx={{ alignItems: 'baseline', justifyContent: 'flex-end', gap: 2 }}
                >
                    <Button
                        variant='text'
                        sx={{ padding: 0 }}
                        onClick={() => global.browser?.runtime?.openOptionsPage()}
                    >
                        see all dramas
                    </Button>
                    <Button
                        variant='text'
                        sx={{ padding: 0 }}
                        onClick={logout}
                    >
                        Logout
                    </Button>
                </Box>
                {errorLoadingDrama && (
                    <Typography color='error'>
                        Unable to load dramas for url. {errorLoadingDrama.message}
                    </Typography>
                )}
                <DramaEditor
                    drama={drama ?? newDrama}
                    onAdd={addDrama}
                    onDelete={removeDrama}
                    onUpdate={updateDrama}
                    error={errorAdding || errorRemoving || errorUpdating}
                    isDeleting={isRemoving}
                    isProcessing={isAdding || isUpdating}
                    isLoading={Boolean(isLoadingDrama && dramaId)}
                />
            </Stack>
        </Box>
    );
}

export { PopupPage };
