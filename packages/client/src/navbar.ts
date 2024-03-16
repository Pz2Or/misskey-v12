import { computed, ref, reactive } from 'vue';
import { $i } from './account';
import { search } from '@/scripts/search';
import * as os from '@/os';
import { i18n } from '@/i18n';
import { ui } from '@/config';
import { unisonReload } from '@/scripts/unison-reload';

export const navbarItemDef = reactive({
	notifications: {
		title: 'notifications',
		icon: 'ti ti-bell',
		show: computed(() => $i != null),
		indicated: computed(() => $i != null && $i.hasUnreadNotification),
		to: '/my/notifications',
	},
	messaging: {
		title: 'messaging',
		icon: 'ti ti-messages',
		show: computed(() => $i != null),
		indicated: computed(() => $i != null && $i.hasUnreadMessagingMessage),
		to: '/my/messaging',
	},
	drive: {
		title: 'drive',
		icon: 'ti ti-cloud',
		show: computed(() => $i != null),
		to: '/my/drive',
	},
	followRequests: {
		title: 'followRequests',
		icon: 'ti ti-user-plus',
		show: computed(() => $i != null && ($i.isLocked || $i.hasPendingReceivedFollowRequest)),
		indicated: computed(() => $i != null && $i.hasPendingReceivedFollowRequest),
		to: '/my/follow-requests',
	},
	explore: {
		title: 'explore',
		icon: 'ti ti-hash',
		to: '/explore',
	},
	announcements: {
		title: 'announcements',
		icon: 'ti ti-speakerphone',
		indicated: computed(() => $i != null && $i.hasUnreadAnnouncement),
		to: '/announcements',
	},
	search: {
		title: 'search',
		icon: 'ti ti-search',
		action: () => search(),
	},
	lists: {
		title: 'lists',
		icon: 'ti ti-list',
		show: computed(() => $i != null),
		to: '/my/lists',
	},
	/*
	groups: {
		title: 'groups',
		icon: 'ti ti-users',
		show: computed(() => $i != null),
		to: '/my/groups',
	},
	*/
	antennas: {
		title: 'antennas',
		icon: 'ti ti-antenna',
		show: computed(() => $i != null),
		to: '/my/antennas',
	},
	favorites: {
		title: 'favorites',
		icon: 'ti ti-star',
		show: computed(() => $i != null),
		to: '/my/favorites',
	},
	pages: {
		title: 'pages',
		icon: 'ti ti-news',
		to: '/pages',
	},
	gallery: {
		title: 'gallery',
		icon: 'ti ti-icons',
		to: '/gallery',
	},
	groups: {
		title: 'groups',
		icon: 'fas fa-users',
		to: '/my/groups',
	},
	clips: {
		title: 'clip',
		icon: 'ti ti-paperclip',
		show: computed(() => $i != null),
		to: '/my/clips',
	},
	channels: {
		title: 'channel',
		icon: 'ti ti-device-tv',
		to: '/channels',
	},
	ui: {
		title: 'switchUi',
		icon: 'ti ti-devices',
		action: (ev) => {
			os.popupMenu([{
				text: i18n.ts.default,
				active: ui === 'default' || ui === null,
				action: () => {
					localStorage.setItem('ui', 'default');
					unisonReload();
				},
			}, {
				text: i18n.ts.deck,
				active: ui === 'deck',
				action: () => {
					localStorage.setItem('ui', 'deck');
					unisonReload();
				},
			}, {
				text: i18n.ts.classic,
				active: ui === 'classic',
				action: () => {
					localStorage.setItem('ui', 'classic');
					unisonReload();
				},
			}], ev.currentTarget ?? ev.target);
		},
	},
	reload: {
		title: 'reload',
		icon: 'ti ti-refresh',
		action: (ev) => {
			location.reload();
		},
	},
});
