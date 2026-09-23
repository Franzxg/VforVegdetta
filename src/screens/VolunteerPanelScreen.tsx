import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RequireRole } from '../components/RequireRole';
import { StatusPill } from '../components/StatusPill';
import { useCommunity } from '../context/CommunityContext';
import type { RootScreenProps } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';
import type { ProductProposal } from '../types/community';

const RECENT_LIMIT = 5;

/** Pannello Volontario (§5.8): coda delle proposte prodotto da revisionare. */
export function VolunteerPanelScreen(props: RootScreenProps<'VolunteerPanel'>) {
  return (
    <RequireRole role="admin">
      <VolunteerPanel {...props} />
    </RequireRole>
  );
}

function VolunteerPanel({ navigation }: RootScreenProps<'VolunteerPanel'>) {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const { data } = useCommunity();

  const proposals = data?.productProposals ?? [];
  const pending = proposals
    .filter(p => p.status === 'pending')
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const recent = proposals
    .filter(p => p.status !== 'pending' && p.reviewedAt)
    .sort((a, b) => (b.reviewedAt ?? '').localeCompare(a.reviewedAt ?? ''))
    .slice(0, RECENT_LIMIT);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(i18n.language);

  return (
    <ScrollView
      style={{ backgroundColor: colors.surface }}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {t('panel.pendingProposals', { count: pending.length })}
      </Text>

      {pending.length === 0 ? (
        <View
          style={[
            styles.card,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
            {t('panel.noProposalsTitle')}
          </Text>
          <Text style={{ color: colors.textSecondary }}>
            {t('panel.noProposalsText')}
          </Text>
        </View>
      ) : (
        pending.map(proposal => (
          <ProposalRow
            key={proposal.id}
            proposal={proposal}
            date={formatDate(proposal.createdAt)}
            onPress={() =>
              navigation.navigate('ProposalReview', {
                proposalId: proposal.id,
              })
            }
          />
        ))
      )}

      {recent.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t('panel.recentlyReviewed')}
          </Text>
          {recent.map(proposal => (
            <View
              key={proposal.id}
              style={[
                styles.card,
                styles.recentRow,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.flex}>
                <Text
                  numberOfLines={1}
                  style={[styles.rowTitle, { color: colors.textPrimary }]}
                >
                  {proposal.reviewedName ?? proposal.barcode}
                </Text>
                <Text style={{ color: colors.textSecondary }}>
                  {proposal.barcode}
                </Text>
              </View>
              <StatusPill status={proposal.status} />
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

function ProposalRow({
  proposal,
  date,
  onPress,
}: {
  proposal: ProductProposal;
  date: string;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View style={styles.rowHeader}>
        <View style={[styles.dot, { backgroundColor: colors.accent }]} />
        <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
          {proposal.barcode}
        </Text>
        <Text style={{ color: colors.textSecondary }}>{date}</Text>
      </View>
      <Text style={{ color: colors.textSecondary }}>
        {t('panel.proposedBy', {
          name: proposal.proposedByName ?? t('panel.anonymous'),
        })}
      </Text>
      {proposal.notes ? (
        <Text
          numberOfLines={2}
          style={[styles.notes, { color: colors.textPrimary }]}
        >
          {proposal.notes}
        </Text>
      ) : null}
      <Text style={[styles.link, { color: colors.primary }]}>
        {t('panel.review')}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  sectionTitle: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notes: {
    marginTop: 4,
    fontStyle: 'italic',
  },
  link: {
    marginTop: 6,
    fontWeight: '600',
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
