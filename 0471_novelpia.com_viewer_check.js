(function () {
    if (location.pathname === '/page/block') return;

    var triggered = false;

    function block() {
        if (triggered) return;   // 중복 차단 방지
        triggered = true;
        location.replace('/page/block');   // 차단 페이지로 이동
    }

    // [신호 1] 콘솔 getter 트랩: 콘솔 탭이 bait 를 펼쳐 렌더링할 때만 id 를 읽음 → 그때만 발동
    var bait = new Image();
    Object.defineProperty(bait, 'id', {
        get: function () {
            block();
            return '';
        }
    });

    document.cookie = '_dtb=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=novelpia.com';

    setInterval(function () {
        // 콘솔 트랩 트리거
        console.log(bait);
        console.clear();

        // [신호 2] 소스맵 핑: 서버가 .map 응답에서 세팅한 쿠키 확인
        // (파일 끝 //# sourceMappingURL 을 DevTools 가 받아가면 /proc/dtmap 이 호출되어 쿠키가 세팅됨)
        if (document.cookie.indexOf('_dtb=1') !== -1) {
            block();
        }
    }, 1000);
})();
//# sourceMappingURL=/proc/dtmap