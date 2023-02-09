import { db } from '@/db/postgre.js';
import { Instance } from '@/models/entities/instance.js';
import { Packed } from '@/misc/schema.js';
import { fetchMeta } from '@/misc/fetch-meta.js';
import { sanitizeUrl } from '@/misc/sanitize-url.js';

export const InstanceRepository = db.getRepository(Instance).extend({
	async pack(
		instance: Instance,
	): Promise<Packed<'FederationInstance'>> {
		const meta = await fetchMeta();
		return {
			id: instance.id,
			caughtAt: instance.caughtAt.toISOString(),
			host: instance.host,
			usersCount: instance.usersCount,
			notesCount: instance.notesCount,
			followingCount: instance.followingCount,
			followersCount: instance.followersCount,
			latestRequestSentAt: instance.latestRequestSentAt ? instance.latestRequestSentAt.toISOString() : null,
			lastCommunicatedAt: instance.lastCommunicatedAt.toISOString(),
			isNotResponding: instance.isNotResponding,
			isSuspended: instance.isSuspended,
			isBlocked: meta.blockedHosts.includes(instance.host),
			softwareName: instance.softwareName,
			softwareVersion: instance.softwareVersion,
			openRegistrations: instance.openRegistrations,
			name: instance.name,
			description: instance.description,
			maintainerName: instance.maintainerName,
			maintainerEmail: instance.maintainerEmail,
			iconUrl: sanitizeUrl(instance.iconUrl) ?? null,
			faviconUrl: sanitizeUrl(instance.faviconUrl) ?? null,
			themeColor: instance.themeColor,
			infoUpdatedAt: instance.infoUpdatedAt ? instance.infoUpdatedAt.toISOString() : null,
		};
	},

	packMany(
		instances: Instance[],
	) {
		return Promise.all(instances.map(x => this.pack(x)));
	},
});
