<template>
<button
	v-if="count > 0"
	ref="buttonRef"
	v-ripple="canToggle"
	class="hkzvhatu _button"
	:class="{ reacted: note.myReaction == reaction, canToggle: (canToggle || instanceReaction) }"
	@click="toggleReaction"
	@contextmenu.stop="onContextmenu"
>
	<XReactionIcon class="icon" :reaction="reaction" :custom-emojis="note.emojis"/>
	<span class="count">{{ count }}</span>
</button>
</template>

<script lang="ts" setup>
// onContextmenu Code written by @sim1222
// original repository: https://github.com/sim1222/misskey
// Code used as reference for instance reaction
// original repository: https://github.com/shrimpia/misskey

import { computed, ComputedRef, defineAsyncComponent, onMounted, ref, watch } from 'vue';
import * as misskey from 'misskey-js';
import XDetails from '@/components/MkReactionsViewer.details.vue';
import XReactionIcon from '@/components/MkReactionIcon.vue';
import * as os from '@/os';
import { useTooltip } from '@/scripts/use-tooltip';
import { $i } from '@/account';
import { openReactionImportMenu } from '@/scripts/reactionImportMenu';
import { instance } from '@/instance';

const props = defineProps<{
	reaction: string;
	count: number;
	isInitial: boolean;
	note: misskey.entities.Note;
}>();

const customEmojis = instance.emojis;

const reactionName = computed(() => {
	const reactions = props.reaction.replace(':', '');
	return reactions.slice(0, reactions.indexOf('@'));
});

const instanceReaction: ComputedRef<string | null> = computed(() => (customEmojis).find(it => it.name === reactionName.value)?.name ?? null);

const buttonRef = ref<HTMLElement>();

const canToggle = computed(() => !props.reaction.match(/@\w/) && $i);

const chooseInstanceReaction = (ev) => {
	if (!instanceReaction.value) return;
	os.api('notes/reactions/create', {
		noteId: props.note.id,
		reaction: `:${instanceReaction.value}:`,
	});
};

const toggleReaction = (ev) => {
	if (!canToggle.value) {
		chooseInstanceReaction(ev);
		return;
	}

	const oldReaction = props.note.myReaction;
	if (oldReaction) {
		os.api('notes/reactions/delete', {
			noteId: props.note.id,
		}).then(() => {
			if (oldReaction !== props.reaction) {
				os.api('notes/reactions/create', {
					noteId: props.note.id,
					reaction: props.reaction,
				});
			}
		});
	} else {
		os.api('notes/reactions/create', {
			noteId: props.note.id,
			reaction: props.reaction,
		});
	}
};

const anime = () => {
	if (document.hidden) return;

	// TODO: 新しくリアクションが付いたことが視覚的に分かりやすいアニメーション
};

watch(() => props.count, (newCount, oldCount) => {
	if (oldCount < newCount) anime();
});

onMounted(() => {
	if (!props.isInitial) anime();
});

useTooltip(buttonRef, async (showing) => {
	const reactions = await os.apiGet('notes/reactions', {
		noteId: props.note.id,
		type: props.reaction,
		limit: 11,
		_cacheKey_: props.count,
	});

	const users = reactions.map(x => x.user);

	os.popup(XDetails, {
		showing,
		reaction: props.reaction,
		emojis: props.note.emojis,
		users,
		count: props.count,
		targetElement: buttonRef.value,
	}, {}, 'closed');
}, 100);

const onContextmenu = (e: MouseEvent) => {
	e.preventDefault();
	openReactionImportMenu(e, props.reaction, props.note.id);
};
</script>

<style lang="scss" scoped>
.hkzvhatu {
	display: inline-block;
	height: 32px;
	margin: 2px;
	padding: 0 6px;
	border-radius: 4px;

	&.canToggle {
		background: rgba(0, 0, 0, 0.05);

		&:hover {
			background: rgba(0, 0, 0, 0.1);
		}
	}

	&:not(.canToggle) {
		cursor: default;
	}

	&.reacted, &.reacted:hover {
		background: var(--accentedBg);
		color: var(--accent);
		border: 1px solid var(--accent);

		> .count {
			color: var(--accent);
		}

		> .icon {
			filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
		}
	}

	> .count {
		font-size: 0.9em;
		line-height: 32px;
		margin: 0 0 0 4px;
	}
}
</style>
