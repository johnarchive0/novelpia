
const recommend_cancel_component = {
    template: `
        <div class="viewer-modal-background" id="viewer-modal">
            <div class="common-layer-wrapper">
                <div class="close-x" @click="close_modal"></div>
                <div class="layer-center-img">
                    <img src="//image.novelpia.com/img/new/viewer/modal_recommend_img.png">
                </div>
                <p class="layer-body-tit">추천을 취소 하시겠습니까?</p>
                <p class="layer-body-txt">추천은 작가님의 집필에 큰 원동력이 됩니다!</p>
                <div class="layer-botton-section">
                    <button class="color-pp" @click="open_modal">추천 유지 할게요!</button>
                </div>
                <div class="layer-botton-section-txt" @click="cancel_recommend">아니요, 그래도 취소할래요!</div>
            </div>
        </div>
    `,
    data: function () {
        return {
            recommendToast: '',
            toastType: ''
        }
    },
    methods: {
        cancel_recommend: function () {
            this.$emit("cancel_recommend");
            this.$emit("open_toast", "cancel");
        },
        open_modal: function () {
            this.$emit("add_recommend")
            this.$emit("open_toast", "recommend");
        },
        close_modal: function () {
            this.$emit('reset_component')
        },
    },
}

export default recommend_cancel_component;