(function () {
    const _LANG = {};
    _LANG.TXT = {
        novel : {
            like_novel : "선호작", // 선호작
            like_novel_reg : "선호작이 등록되었습니다.。" , // 선호작이 등록되었습니다.
            like_novel_del : "선호작이 해제되었습니다.。", // 선호작이 해제되었습니다.
            not_login_no_like_novel : "선호작 등록을 위해서는 로그인이 필요합니다.\n로그인 하시겠습니까?" , // 선호작 등록을 위해서는 로그인이 필요합니다.\n로그인 하시겠습니까?
        },
        viewer : {
            not_next_episode : "다음 등록 된 회차가 없습니다.",   // 다음 등록 된 회차가 없습니다.
            not_min_size_font : "더 작은 글자 크기를 제공하지 않습니다.。", // 더 작은 글자 크기를 제공하지 않습니다.
            not_max_size_font : "더 큰 글자 크기를 제공하지 않습니다.。", // 더 큰 글자 크기를 제공하지 않습니다.
            not_min_line_height : "더 좁은 줄간격을 제공하지 않습니다.。",  // 더 좁은 줄간격을 제공하지 않습니다.
            not_max_line_height : "더 넓은 줄간격을 제공하지 않습니다.。",  // 더 넓은 줄간격을 제공하지 않습니다.

            not_login_no_goods : "추천을 위해서는 로그인이 필요합니다.\n 로그인 하시겠습니까?", //추천을 위해서는 로그인이 필요합니다.\n 로그인 하시겠습니까?
            cover_open : "커버보기", // 커버보기
            cover_close : "커버접기" , // 커버접기
        },
        comment : {
            update : "댓글이 수정되었습니다。",  // 댓글이 수정되었습니다
            confirm_del : "정말 댓글을 삭제하시겠습니까?", // 정말 댓글을 삭제하시겠습니까?
            del : "댓글이 삭제되었습니다.",  // 댓글이 삭제되었습니다
            reg : "댓글이 등록되었습니다",  // 댓글이 등록되었습니다

            emoticon_page_move : "이모티콘 뽑기 페이지로 이동하시겠습니까?", //이모티콘 뽑기 페이지로 이동하시겠습니까?
            openstore_page_move : "오픈스토어 페이지로 이동하시겠습니까?", //오픈스토어 페이지로 이동하시겠습니까?
            emoticon_buy : "해당 이모티콘을 구매 하시겠습니까?", //해당 이모티콘을 구매 하시겠습니까?
            buy_success: "정상적으로 구매완료 되었습니다.", //정상적으로 구매완료 되었습니다.
            sale_ready : "판매가 준비 중인 상품입니다.", //판매가 준비 중인 상품입니다.
            buy_end : "구매가 종료된 상품입니다.", //구매가 종료된 상품입니다.
            game_clear_emoticon : "노벨피아 디펜스게임 클리어 보상 이모티콘입니다.", //노벨피아 디펜스게임 클리어 보상 이모티콘입니다.
            payment_emoticon : "노벨피아 결제자 혜택 전용 이모티콘입니다.", //노벨피아 결제자 혜택 전용 이모티콘입니다.
            gacha_emoticon : "노벨피아 가챠뽑기 전용 이모티콘입니다.", //노벨피아 가챠뽑기 전용 이모티콘입니다.
            mileage_emoticon : "가챠뽑기 마일리지 교환 전용 이모티콘입니다.", //가챠뽑기 마일리지 교환 전용 이모티콘입니다.
            not_coin : "코인이 부족합니다.\n충전 하시겠습니까.", //코인이 부족합니다.충전 하시겠습니까.
            defalut_emoticon : "기본 이모티콘은 구매하실 수 없습니다.", //기본 이모티콘은 구매하실 수 없습니다.
            openstore_logout_error : "로그아웃이 되었거나 유효하지 않은 접근입니다.", //로그아웃이 되었거나 유효하지 않은 접근입니다.
            season_five_gacha : "시즌5 뽑기로 편성될 이모티콘입니다. 나중에 만나요~", //시즌5 뽑기로 편성될 이모티콘입니다. 나중에 만나요~
        },
        common: {
            error : " 에러가 발생하였습니다.",  // 에러가 발생하였습니다.
            login : "로그인이 필요합니다.\n로그인 하시겠습니까?",  // 로그인이 필요합니다.\n로그인 하시겠습니까?.
            access_error : "잘못된 접근입니다", //잘못된 접근입니다
        },
        payment : {
            info_agreement : "결제 안내사항에 동의해주시기 바랍니다.", // 결제 안내사항에 동의해주시기 바랍니다.
        }
    };
    _LANG.IMG = {

    }

    // 공통
    const fn_obj = {
        obj_search : R.curry((txt, obj) => {
            if(!txt) {
                return ""; 
            }
            const result = R.pipe(
                R.split("."),
                R.reduce((acc, iter)=> acc[iter], obj)
            )(txt) ;
            return R.type(result) == "String" ? result : "" ;
        })
    };


    // 실적용
    const result_obj = {
        getLangImg : (txt)=> fn_obj.obj_search(txt)(_LANG.IMG) ,
        getLangTxt : (txt)=> fn_obj.obj_search(txt)(_LANG.TXT) ,
    };
    Object.assign(window, result_obj) ;
})() ;
