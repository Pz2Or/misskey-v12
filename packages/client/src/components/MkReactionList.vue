<template>
    <div ref="el">
        <MkModalWindow ref="dialog" :width="800" @close="dialog?.close()" @click="dialog?.close()"
            @closed="$emit('closed')">
            <template #header>リアクションリスト</template>
            <MkStickyContainer>
                <FormFolder class="_gap" v-for="(count, reaction) in note.reactions"> <template #label>
                        <MkReactionIcon :reaction="reaction" :custom-emojis="note.emojis" /> {{ reaction.replace("@.",
            "") }}
                    </template>
                    <template #suffix>{{ count + "人がリアクションしました" }}</template>
                    <XReaction :key="reaction" :reaction="reaction" :count="count"
                        :is-initial="initialReactions.has(reaction)" :note="note" />
                    <div class="userList">
                        <MkA v-for="u in users" :key="u.id" :to="`/@${u.username}@${u.host ? u.host : ''}`"
                            @click="dialog?.close()">
                            <MkUserCardMini :user="u" />
                        </MkA>
                    </div>
                </FormFolder>
            </MkStickyContainer>
        </MkModalWindow>
    </div>
</template>
<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useNoteCapture } from "@/scripts/use-note-capture";
import * as misskey from "misskey-js"; import MkFolder from "@/components/MkFolder.vue"; 
import FormFolder from "@/components/form/folder.vue"; 
import MkUserCardMini from "@/components/MkUserCardMini.vue"; 
import MkReactionIcon from "@/components/MkReactionIcon.vue"; 
import MkModalWindow from "@/components/MkModalWindow.vue"; 
import * as os from "@/os"; 
import XDetails from "@/components/MkReactionsViewer.details.vue"; 
import XReaction from '@/components/MkReactionsViewer.reaction.vue'; 
import { NoteReaction, UserLite } from "misskey-js/built/entities"; 
import MkModal from "@/components/MkModal.vue"; 

const props = defineProps<{ note: misskey.entities.Note; }>(); 
const dialog = $ref<InstanceType<typeof MkModalWindow>>(); 
const el = ref<HTMLElement>(); const isDeleted = ref(); 
const reactions = ref([] as NoteReaction[]); const users = ref([] as UserLite[]); 
const initialReactions = new Set(Object.keys(props.note.reactions)); 
    
onMounted(async () => { 
    reactions.value = await os.apiGet('notes/reactions', { 
        noteId: props.note.id, limit: 100, }); 
        users.value = reactions.value.map(x => x.user); 
    }
);
// useNoteCapture({// 	rootEl: el,// 	note: $$(props.note),// 	isDeletedRef: isDeleted,// });
</script>
<style scoped>
.userList {
    display: flex;
    flex-wrap: wrap;
}
</style>