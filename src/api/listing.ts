import axiosClient from '@api/client';

interface ViewResponse {
  message: string;
}

export const incrementListingView = async (
  listingId: string,
  viewerId: string,
): Promise<ViewResponse | null> => {
  try {
    const response = await axiosClient.post<ViewResponse>(
      `/listing/incrementView`,
      {
        listingId,
        viewerId,
      },
    );
    return response.data;
  } catch (error) {
    console.error('INCREMENT_LISTING_VIEW_ERROR', error);
    return null;
  }
};
