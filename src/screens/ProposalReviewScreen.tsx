import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Text } from '../components/Text';
import { AppButton } from '../components/AppButton';
import { PhotoViewer } from '../components/PhotoViewer';
import { ProposalPhoto } from '../components/ProposalPhoto';
import { RequireRole } from '../components/RequireRole';
import {
  SegmentOption,
  SegmentedControl,
} from '../components/SegmentedControl';
import { StateView } from '../components/StateView';
import { StatusPill } from '../components/StatusPill';
import { TextField } from '../components/TextField';
import { useAuth } from '../context/AuthContext';
import { useCommunity } from '../context/CommunityContext';
import type { RootScreenProps } from '../navigation/types';
import { loadProposalPhotos } from '../services/community';
import { useTheme } from '../theme/ThemeContext';
import {
  PHOTO_KINDS,
  ProposalPhotos,
  ReviewedVeganStatus,
} from '../types/community';

export function ProposalReviewScreen(props: RootScreenProps<'ProposalReview'>) {
  return (
    <RequireRole role="admin">
      <ProposalReview {...props} />
    </RequireRole>
  );
}

/**
 * Revisione di una proposta (§5.8): il volontario guarda le tre foto,
 * compila i dati strutturati e approva, oppure rifiuta.
 */
function ProposalReview({
  navigation,
  route,
}: RootScreenProps<'ProposalReview'>) {
  const { proposalId } = route.params;
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const { session } = useAuth();
  const { data, approveProposal, rejectProposal } = useCommunity();
  const proposal = data?.productProposals.find(p => p.id === proposalId);

  const [photos, setPhotos] = useState<ProposalPhotos | null>(null);
  const [viewer, setViewer] = useState<{ uri: string; label: string } | null>(
    null,
  );
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [verdict, setVerdict] = useState<ReviewedVeganStatus | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadProposalPhotos(proposalId).then(setPhotos);
  }, [proposalId]);

  if (!proposal || !session) {
    return (
      <StateView
        title={t('review.notFoundTitle')}
        message={t('review.notFoundText')}
      >
        <AppButton title={t('common.back')} onPress={navigation.goBack} />
      </StateView>
    );
  }

  const verdictOptions: SegmentOption<ReviewedVeganStatus>[] = [
    { value: 'vegan', label: t('verdict.vegan') },
    { value: 'non_vegan', label: t('verdict.non_vegan') },
    { value: 'maybe', label: t('verdict.maybe') },
  ];

  const nameError = showErrors && !name.trim() ? t('form.required') : null;
  const ingredientsError =
    showErrors && !ingredients.trim() ? t('form.required') : null;
  const verdictError = showErrors && !verdict;

  const approve = async () => {
    setRejecting(false);
    setShowErrors(true);
    if (!name.trim() || !ingredients.trim() || !verdict) {
      return;
    }
    setBusy(true);
    await approveProposal(
      proposal.id,
      { name, ingredientsText: ingredients, veganStatus: verdict },
      session.userId,
    );
    setBusy(false);
    navigation.goBack();
  };

  const reject = async () => {
    setBusy(true);
    await rejectProposal(proposal.id, reason, session.userId);
    setBusy(false);
    navigation.goBack();
  };

  const isPending = proposal.status === 'pending';

  return (
    <ScrollView
      style={{ backgroundColor: colors.surface }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={[
          styles.card,
          { backgroundColor: colors.background, borderColor: colors.border },
        ]}
      >
        <View style={styles.headerRow}>
          <Text style={[styles.barcode, { color: colors.textPrimary }]}>
            {proposal.barcode}
          </Text>
          <StatusPill status={proposal.status} />
        </View>
        <Text style={{ color: colors.textSecondary }}>
          {t('panel.proposedBy', {
            name: proposal.proposedByName ?? t('panel.anonymous'),
          })}{' '}
          · {new Date(proposal.createdAt).toLocaleDateString(i18n.language)}
        </Text>
        {proposal.notes ? (
          <Text style={[styles.notes, { color: colors.textPrimary }]}>
            {proposal.notes}
          </Text>
        ) : null}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {t('review.photos')}
      </Text>
      {photos ? (
        <View style={styles.photos}>
          {PHOTO_KINDS.map(kind => {
            const label = t(`propose.photo.${kind}`);
            return (
              <Pressable
                key={kind}
                accessibilityRole="imagebutton"
                accessibilityLabel={label}
                onPress={() => setViewer({ uri: photos[kind], label })}
                style={styles.photoItem}
              >
                <ProposalPhoto
                  uri={photos[kind]}
                  label={label}
                  style={styles.photo}
                />
                <Text
                  numberOfLines={2}
                  style={[styles.photoLabel, { color: colors.textSecondary }]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <ActivityIndicator color={colors.primary} />
      )}
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        {t('review.tapToEnlarge')}
      </Text>

      {isPending ? (
        <>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t('review.dataTitle')}
          </Text>
          <TextField
            label={t('review.name')}
            value={name}
            onChangeText={setName}
            maxLength={100}
            error={nameError}
          />
          <TextField
            label={t('review.ingredients')}
            placeholder={t('review.ingredientsPlaceholder')}
            value={ingredients}
            onChangeText={setIngredients}
            multiline
            maxLength={2000}
            error={ingredientsError}
          />
          <Text style={[styles.label, { color: colors.textPrimary }]}>
            {t('review.verdict')}
          </Text>
          <SegmentedControl
            options={verdictOptions}
            selected={verdict}
            onChange={setVerdict}
          />
          {verdictError && (
            <Text style={[styles.error, { color: colors.accent }]}>
              {t('review.verdictRequired')}
            </Text>
          )}

          <AppButton
            title={busy ? t('common.loading') : t('review.approve')}
            onPress={approve}
            disabled={busy}
            style={styles.approve}
          />

          {rejecting ? (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <TextField
                label={t('review.rejectReason')}
                placeholder={t('review.rejectReasonPlaceholder')}
                value={reason}
                onChangeText={setReason}
                multiline
                maxLength={300}
              />
              <View style={styles.rejectActions}>
                <AppButton
                  variant="ghost"
                  title={t('scan.manualCancel')}
                  onPress={() => setRejecting(false)}
                  style={styles.flex}
                />
                <AppButton
                  variant="secondary"
                  title={t('review.confirmReject')}
                  onPress={reject}
                  disabled={busy}
                  style={styles.flex}
                />
              </View>
            </View>
          ) : (
            <AppButton
              variant="ghost"
              title={t('review.reject')}
              onPress={() => setRejecting(true)}
            />
          )}
        </>
      ) : (
        <View
          style={[
            styles.card,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <Text style={{ color: colors.textPrimary }}>
            {proposal.status === 'approved'
              ? t('review.alreadyApproved', { name: proposal.reviewedName })
              : t('review.alreadyRejected')}
          </Text>
          {proposal.rejectionReason ? (
            <Text style={{ color: colors.textSecondary }}>
              {proposal.rejectionReason}
            </Text>
          ) : null}
        </View>
      )}

      <PhotoViewer photo={viewer} onClose={() => setViewer(null)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 14,
  },
  flex: {
    flex: 1,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  barcode: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
  },
  notes: {
    marginTop: 4,
    fontStyle: 'italic',
  },
  sectionTitle: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  photos: {
    flexDirection: 'row',
    gap: 10,
  },
  photoItem: {
    flex: 1,
    gap: 4,
  },
  photo: {
    width: '100%',
    aspectRatio: 1,
  },
  photoLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  hint: {
    fontSize: 12,
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  error: {
    fontSize: 13,
  },
  approve: {
    marginTop: 8,
  },
  rejectActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
});
