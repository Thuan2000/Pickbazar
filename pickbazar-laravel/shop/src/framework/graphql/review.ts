import { useModalAction } from '@/components/ui/modal/modal.context';
import type { ReviewQueryOptions } from '@/types';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import { CreateReviewInput, UpdateReviewInput } from '__generated__/__types__';
import {
  useCreateReviewMutation,
  useReviewsQuery,
  useUpdateReviewMutation,
} from './gql/reviews.graphql';

export function useReviews({
  limit,
  rating,
  orderBy,
  sortedBy,
  ...options
}: ReviewQueryOptions) {
  const {
    data,
    loading: isLoading,
    error,
  } = useReviewsQuery({
    variables: {
      ...options,
      ...(limit && { first: limit }),
      ...(rating && { rating: Number(rating) }),
      ...(orderBy && {
        orderBy: [{ column: orderBy.toUpperCase(), order: sortedBy }],
      }),
    },
  });
  return {
    reviews: data?.reviews?.data ?? [],
    paginatorInfo: data?.reviews?.paginatorInfo,
    isLoading,
    error,
  };
}

export function useCreateReview() {
  const { t } = useTranslation('common');
  const { closeModal } = useModalAction();
  const [create, { loading: isLoading }] = useCreateReviewMutation({
    // refetchQueries: ['Reviews'],
    onCompleted: (data) => {
      toast.success(t('text-review-request-submitted'));
      // queryClient.refetchQueries([API_ENDPOINTS.PRODUCTS, res?.product_id!]);
      closeModal();
    },
  });

  function createReview(input: CreateReviewInput) {
    create({ variables: { input } });
  }

  return {
    createReview,
    isLoading,
  };
}

export function useUpdateReview() {
  const { t } = useTranslation('common');
  const { closeModal } = useModalAction();
  const [update, { loading: isLoading }] = useUpdateReviewMutation({
    onCompleted: (data) => {
      toast.success(t('text-review-request-update-submitted'));
      closeModal();
    },
  });
  function updateReview({ id, ...input }: UpdateReviewInput & { id: string }) {
    update({ variables: { id, input } });
  }
  return {
    updateReview,
    isLoading,
  };
}
