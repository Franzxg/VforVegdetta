import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { RequireRole } from '../components/RequireRole';
import { useCommunity } from '../context/CommunityContext';
import { useTheme } from '../theme/ThemeContext';
import type { VolunteerRequest } from '../types/community';

/** Pannello Super Admin (§5.9): candidature volontario da approvare. */
export function SuperAdminPanelScreen() {
  return (
    <RequireRole role="superadmin">
      <SuperAdminPanel />
    </RequireRole>
  );
}

function SuperAdminPanel() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { data } = useCommunity();

  const pending = (data?.volunteerRequests ?? [])
    .filter(r => r.status === 'pending')
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const volunteers = data?.volunteers ?? [];

  return (
    <ScrollView
      style={{ backgroundColor: colors.surface }}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {t('superAdmin.pendingRequests', { count: pending.length })}
      </Text>
      {pending.length === 0 ? (
        <View
          style={[
            styles.card,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {t('superAdmin.noRequestsTitle')}
          </Text>
          <Text style={{ color: colors.textSecondary }}>
            {t('superAdmin.noRequestsText')}
          </Text>
        </View>
      ) : (
        pending.map(request => (
          <RequestCard key={request.id} request={request} />
        ))
      )}

      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {t('superAdmin.volunteers', { count: volunteers.length })}
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.background, borderColor: colors.border },
        ]}
      >
        {volunteers.length === 0 ? (
          <Text style={{ color: colors.textSecondary }}>
            {t('superAdmin.noVolunteers')}
          </Text>
        ) : (
          volunteers.map(volunteer => (
            <View key={volunteer.id} style={styles.volunteerRow}>
              <Text
                style={[styles.volunteerName, { color: colors.textPrimary }]}
              >
                {volunteer.name}
              </Text>
              <Text style={{ color: colors.textSecondary }}>
                {volunteer.contact}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

function RequestCard({ request }: { request: VolunteerRequest }) {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const { approveVolunteerRequest, rejectVolunteerRequest } = useCommunity();
  const [confirmReject, setConfirmReject] = useState(false);
  const [busy, setBusy] = useState(false);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.background, borderColor: colors.border },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={[styles.dot, { backgroundColor: colors.accent }]} />
        <Text
          style={[styles.title, styles.flex, { color: colors.textPrimary }]}
        >
          {request.name}
        </Text>
        <Text style={{ color: colors.textSecondary }}>
          {new Date(request.createdAt).toLocaleDateString(i18n.language)}
        </Text>
      </View>
      <Text style={{ color: colors.textSecondary }}>{request.contact}</Text>

      <Field label={t('volunteer.availability')} value={request.availability} />
      <Field label={t('superAdmin.motivation')} value={request.motivation} />

      {confirmReject ? (
        <View style={styles.actions}>
          <Text style={[styles.confirmText, { color: colors.textPrimary }]}>
            {t('superAdmin.confirmReject', { name: request.name })}
          </Text>
          <View style={styles.row}>
            <AppButton
              variant="ghost"
              title={t('scan.manualCancel')}
              onPress={() => setConfirmReject(false)}
              style={styles.flex}
            />
            <AppButton
              variant="secondary"
              title={t('superAdmin.reject')}
              onPress={() => run(() => rejectVolunteerRequest(request.id))}
              disabled={busy}
              style={styles.flex}
            />
          </View>
        </View>
      ) : (
        <View style={[styles.row, styles.actions]}>
          <AppButton
            variant="ghost"
            title={t('superAdmin.reject')}
            onPress={() => setConfirmReject(true)}
            disabled={busy}
            style={styles.flex}
          />
          <AppButton
            title={t('superAdmin.approve')}
            onPress={() => run(() => approveVolunteerRequest(request.id))}
            disabled={busy}
            style={styles.flex}
          />
        </View>
      )}
    </View>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text style={{ color: colors.textPrimary }}>{value}</Text>
    </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  field: {
    marginTop: 8,
    gap: 2,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actions: {
    marginTop: 12,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmText: {
    fontWeight: '600',
  },
  volunteerRow: {
    paddingVertical: 6,
  },
  volunteerName: {
    fontSize: 15,
    fontWeight: '600',
  },
});
