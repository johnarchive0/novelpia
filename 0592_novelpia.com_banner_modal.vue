<template>
    <div class="banner-modal-background">
        <div class="banner-modal-wrapper">
            <div class="banner-modal-content">
                <div class="banner-modal-close" :class="{ 'banner-modal-close-center': close_delay_seconds > 0, 'banner-modal-close-disabled': is_show_close === false }" @click="close">
                    <svg v-if="close_delay_seconds > 0 && is_show_close === false" viewBox="0 0 44 44">
                        <circle class="banner-modal-close-ring-bg" cx="22" cy="22" r="20"></circle>
                        <circle class="banner-modal-close-ring-bar" cx="22" cy="22" r="20" :style="close_progress_style"></circle>
                    </svg>
                </div>
                <a class="banner-modal-link" href="javascript://" @click="move_banner_link">
                    <img class="banner-modal-img banner-modal-img-pc" :src="view_img_src">
                    <img class="banner-modal-img banner-modal-img-m" :src="view_m_img_src">
                </a>
                <div class="banner-modal-button-wrapper" v-if="button_text !== ''">
                    <button type="button" class="banner-modal-button" :style="button_style" @click="move_link">{{ button_text }}</button>
                </div>
            </div>
            <a class="banner-modal-hide" v-if="cookie_name !== '' && is_auto_cookie === false" @click="hide_for_days">
                <span>{{ hide_text_view }}</span>
            </a>
        </div>
    </div>
</template>

<script>
    module.exports = {
        name: "banner_modal",
        props: {
            flag_type: {
                type: Number,
                default: null
            },
            img_src: {
                type: String,
                default: ""
            },
            m_img_src: {
                type: String,
                default: ""
            },
            link: {
                type: String,
                default: ""
            },
            button_text: {
                type: String,
                default: ""
            },
            button_link: {
                type: String,
                default: ""
            },
            button_style: {
                type: Object,
                default: () => ({})
            },
            cookie_name: {
                type: String,
                default: ""
            },
            cookie_days: {
                type: Number,
                default: 7
            },
            cookie_minutes: {
                type: Number,
                default: 0
            },
            is_auto_cookie: {
                type: Boolean,
                default: false
            },
            is_static_backdrop: {
                type: Boolean,
                default: false
            },
            close_delay_seconds: {
                type: Number,
                default: 0
            },
            cookie_domain: {
                type: String,
                default: location.hostname
            },
            hide_text: {
                type: String,
                default: ""
            },
            is_close_cookie: {
                type: Boolean,
                default: false
            },
            is_monthly_reset: {
                type: Boolean,
                default: false
            },
            monthly_reset_day: {
                type: Number,
                default: 1
            },
            stat_flag_type: {
                type: Number,
                default: 0
            },
            stat_click_flag_type: {
                type: Number,
                default: 0
            }
        },
        data: function () {
            return {
                banner: {},
                is_show_close: this.close_delay_seconds === 0,
                is_close_progress: false
            };
        },
        computed: {
            hide_text_view: function () {
                if (this.hide_text !== "") {
                    return this.hide_text;
                }

                // 매월 재노출(월 단위 리셋)인 경우 기간 문구가 맞지 않으므로 "다시 보지 않기"로 표시
                if (this.is_monthly_reset === true) {
                    return "다시 보지 않기";
                }

                if (this.cookie_minutes > 0) {
                    return this.cookie_minutes + "분동안 보지 않기";
                }

                return this.cookie_days + "일동안 보지 않기";
            },
            view_img_src: function () {
                if (this.is_empty(this.banner) === false) {
                    return this.banner.banner_link;
                }

                return this.img_src;
            },
            view_m_img_src: function () {
                if (this.is_empty(this.banner) === false) {
                    return this.banner.m_banner_link !== "" ? this.banner.m_banner_link : this.banner.banner_link;
                }

                return this.m_img_src !== "" ? this.m_img_src : this.img_src;
            },
            view_link: function () {
                if (this.is_empty(this.banner) === false) {
                    return this.banner.link;
                }

                return this.link;
            },
            close_progress_style: function () {
                const circumference = 125.66;

                return {
                    "stroke-dasharray": circumference,
                    "stroke-dashoffset": this.is_close_progress === true ? 0 : circumference,
                    "transition": "stroke-dashoffset " + this.close_delay_seconds + "s linear"
                };
            }
        },
        methods: {
            is_empty: function (obj) {
                if (Object.keys(obj).length === 0) {
                    return true;
                }

                return false;
            },
            close: function () {
                if (this.is_show_close === false) {
                    this.$emit("early_close");
                    return;
                }

                if ((this.is_auto_cookie === true || this.is_close_cookie === true) && this.cookie_name !== "") {
                    this.set_cookie();
                }

                $(this.$el).modal('hide');
                this.$emit("close");
            },
            hide_for_days: function () {
                this.set_cookie();
                this.close();
            },
            set_cookie: function () {
                let expire_days = this.cookie_days;

                if (this.is_monthly_reset === true) {
                    expire_days = this.get_monthly_reset_expire_days();
                } else if (this.cookie_minutes > 0) {
                    expire_days = this.cookie_minutes / 1440;
                }

                $.cookie(this.cookie_name, "1", { expires: expire_days, path: "/", domain: this.cookie_domain, secure: false });
            },
            get_monthly_reset_expire_days: function () {
                const now = new Date();
                const reset_day = this.monthly_reset_day;

                let next_reset = new Date(now.getFullYear(), now.getMonth(), reset_day, 0, 0, 0, 0);
                if (now >= next_reset) {
                    next_reset = new Date(now.getFullYear(), now.getMonth() + 1, reset_day, 0, 0, 0, 0);
                }

                const diff_ms = next_reset.getTime() - now.getTime();
                return diff_ms / (1000 * 60 * 60 * 24);
            },
            inc_banner_stat: function (flag_type) {
                // 배너 노출/클릭 통계
                if (flag_type <= 0) {
                    return;
                }

                inc_stat("stat_induce_pay", {
                    flag_type: flag_type,
                    item_no: 0
                });
            },
            move_banner_link: function () {
                const is_out_site = Number(this.banner.flag_link_target) === 1;

                // 광고 클릭 통계 (클릭 전용 flag_type)
                this.inc_banner_stat(this.stat_click_flag_type);

                this.go_link(this.view_link, is_out_site);

                // 광고 클릭 시 - 쿠키 생성 및 광고 닫음
                if ((this.is_auto_cookie === true || this.is_close_cookie === true) && this.cookie_name !== "") {
                    this.set_cookie();
                }

                $(this.$el).modal('hide');
                this.$emit("close");
            },
            move_link: function () {
                const move_url = this.button_link !== "" ? this.button_link : this.view_link;
                const is_out_site = this.button_link === "" && Number(this.banner.flag_link_target) === 1;

                this.go_link(move_url, is_out_site);
            },
            go_link: function (url, is_out_site) {
                if (url === "") {
                    return;
                }

                if (is_out_site === true) {
                    out_site_go(url, 1);
                    return;
                }

                location.href = url;
            },
            get_banner: async function () {
                const url = "/proc/banner";
                const data = {
                    cmd: "banner",
                    flag_type: this.flag_type,
                    rows: 1
                };

                const http_result = await http("get", url, data);
                const { status, banner } = http_result;

                if (Number(status) !== 200) {
                    return;
                }

                if (Array.isArray(banner) === true && banner.length > 0) {
                    this.banner = banner[0];
                }
            }
        },
        mounted: async function () {
            if (this.cookie_name !== "" && $.cookie(this.cookie_name) === "1") {
                return;
            }

            if (this.flag_type !== null) {
                await this.get_banner();

                if (this.is_empty(this.banner) === true) {
                    return;
                }
            } else if (this.img_src === "") {
                return;
            }

            if (this.is_static_backdrop === true) {
                $(this.$el).modal({ backdrop: "static", keyboard: false });
            } else {
                $(this.$el).modal("show");
            }

            // 배너 노출 통계 (노출 전용 flag_type)
            this.inc_banner_stat(this.stat_flag_type);

            if (this.close_delay_seconds > 0) {
                setTimeout(() => {
                    this.is_close_progress = true;
                }, 50);

                setTimeout(() => {
                    this.is_show_close = true;
                }, this.close_delay_seconds * 1000);
            }
        }
    };
</script>

<style scoped>
    .banner-modal-background {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9990;
        background-color: rgba(0, 0, 0, 0.4);
    }

    .banner-modal-background .banner-modal-wrapper {
        display: flex;
        flex-direction: column;
        margin: auto;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
    }

    .banner-modal-background .banner-modal-content {
        width: 100%;
        position: relative;
    }

    .banner-modal-background .banner-modal-close {
        position: absolute;
        top: -40px;
        right: -24px;
        width: 70px;
        height: 70px;
        color: #fff;
        z-index: 5;
        text-align: center;
        line-height: 50px;
        cursor: pointer;
        display: inline-block;
    }

    .banner-modal-background .banner-modal-close:after {
        display: inline-block;
        content: "\00d7";
        font-size: 30px;
    }

    .banner-modal-background .banner-modal-close.banner-modal-close-center {
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: normal;
        top: -60px;
    }

    .banner-modal-background .banner-modal-close.banner-modal-close-disabled {
        cursor: default;
    }

    .banner-modal-background .banner-modal-close.banner-modal-close-disabled:after {
        opacity: 0.5;
    }

    .banner-modal-background .banner-modal-close svg {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 44px;
        height: 44px;
        transform: translate(-50%, -50%) rotate(-90deg);
    }

    .banner-modal-background .banner-modal-close .banner-modal-close-ring-bg {
        fill: none;
        stroke: rgba(255, 255, 255, 0.3);
        stroke-width: 3;
    }

    .banner-modal-background .banner-modal-close .banner-modal-close-ring-bar {
        fill: none;
        stroke: #fff;
        stroke-width: 3;
        stroke-linecap: round;
    }

    .banner-modal-background .banner-modal-link {
        display: block;
    }

    .banner-modal-background .banner-modal-img {
        width: 100%;
    }

    .banner-modal-background .banner-modal-button-wrapper {
        width: 100%;
    }

    .banner-modal-background .banner-modal-button {
        width: 100%;
        height: 80px;
        font-size: 24px;
        border: none;
        cursor: pointer;
        color: #fff;
        background-color: #2c99ad;
    }

    .banner-modal-background .banner-modal-hide,
    .banner-modal-background .banner-modal-hide:hover,
    .banner-modal-background .banner-modal-hide:focus,
    .banner-modal-background .banner-modal-hide:active {
        color: #fff;
        text-align: center;
        text-decoration: underline;
        font-size: 16px;
        margin-top: 10px;
        cursor: pointer;
    }

    .banner-modal-background .banner-modal-hide span,
    .banner-modal-background .banner-modal-hide:hover span {
        background: #3f3f3f;
        padding: 0 10px;
    }

    @media screen and (min-width: 892px) {
        .banner-modal-background .banner-modal-wrapper {
            width: 90%;
            max-width: 500px;
        }

        .banner-modal-background .banner-modal-img-m {
            display: none;
        }
    }

    @media screen and (max-width: 891px) {
        .banner-modal-background .banner-modal-wrapper {
            width: 80%;
            max-width: 360px;
        }

        .banner-modal-background .banner-modal-img-pc {
            display: none;
        }
    }

    @media screen and (max-height: 500px) {
        .banner-modal-background .banner-modal-wrapper {
            max-width: 260px;
        }
    }
</style>
