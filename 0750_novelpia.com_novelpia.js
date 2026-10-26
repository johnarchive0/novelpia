	const G_CDN_DOMAIN_IMG = "//images.novelpia.com" ;  // CDN1
	const G_OLD_CDN_DOMAIN_IMG = "//image.novelpia.com" ;  // 구 CDN 주소
	const G_CDN_DOMAIN_IMG2 = "//images.novelpia.com" ;  // CDN2
	const G_DOMAIN = new URL(location).origin;				// 사이트 도메인
	const G_HOST = new URL(location).host;					// 사이트 HOST
	const G_COOKIE_HOST = ".novelpia.com";					// 쿠키 호스트

	function pageload(url, option) {
		//$('.loads').show();
		// $('#novel_box').animate({ scrollTop: 0 }, 0, function() { move_key = 0; } );
        move_key = 0;
		$('#novel_box').show();
		if(option == 1) {
			if(history.replaceState){ 
				history.replaceState(null, document.title, url); history.go(0);
			} else { 
				location.replace = url;
			}
		} else {
			location.href = url;
		}
	}

	function hashload(data) {
			$('.loads').show();
			location='/search/hash/date/1/' + decodeURI(data);
	}


	/**
	 * 소설 검색 modal 창
	 * @param search_text
	 * @param data ajax data
	 * @param select_btn_event_cb  선택하기 눌렀을시 event callback 
	 */
	var g_novel = {} ;
	function novel_search_modal(search_text, data, select_btn_event_cb) {
		var modal_novel_search = function  (search_text) {
			$.ajax({
				type: 'post'
				, url: '/proc/novelsearch/' + search_text
				, data : data
				, cache: false
				, success: function(data) {
					var result = data.result || "" ;
					if(result == "success") {
						novel_search_html_make(data.data) ;
					} else {
						var err_msg = data.err_msg || "연동 오류 ";
						alert(err_msg) ;
					}
				}
				, error: function(data, status, err){
				}
				, beforeSend : function () {
					$('.loads').show();
				}
				, complete: function(){
					$('.loads').hide();
				}
			});
		}


		var novel_search_html_make = function (data){

			$("#novel_search_modal").remove();
			g_novel = {};
			var html_str = "";
			var novel_list = data.search_result ;

			if(novel_list.length == 0 ){
				alert("검색 내역이 없습니다.");
				return ;
			}

			html_str += "<div id=\"novel_search_modal\" class=\"modal fade cust_modal\" >";
			html_str += "	<div class=\"modal-dialog modal-lg\" role=\"document\">";
			html_str += "		<div class=\"modal-content bd-0 tx-14\">";
			html_str += " 			<div class=\"modal-body pd-20\">";
			html_str += "				<p class=\"mg-b-5\">";

			for (var i = 0; i < novel_list.length; i++) {
				var d = novel_list[i] ;
				var novel_no = d.novel_no ;
				var novel_name = d.novel_name ;
				var mem_nick = d.mem_nick ;
				var is_secondary_creation = d.is_secondary_creation ;
				var is_secondary_creation_str =  is_secondary_creation == 1 ? "2차 창작 허용" : "";
				var novel_thumb = d.novel_thumb || d.novel_thumb_all || "//image.novelpia.com/img/layout/ready2.jpg" ;
				g_novel[novel_no] = d ;

				html_str += "<div class='select-novel'>";
				html_str += "   <div class='select-novel-item'><div><img src='"+novel_thumb+"' alt='"+novel_name+"' title='"+novel_name+"'></div>";
				html_str += "   <div>";
				html_str += "       <p style='margin-left: 31px; '>";
				// html_str += "           <span>작품제목</span>";
				html_str += "           <span title='"+novel_name+"' style='font-weight: bold;  '>"+ novel_name +"</span>";

				html_str += "       </p>";
				html_str += "       <p style='margin-left: 31px; margin-top: 27px; background: #EAEAEA; padding: 15px;  '>";
				html_str += "           <span title='"+mem_nick+"'>"+ mem_nick +"</span><br>";
				html_str += "           <span style='color: #4B7CAE'>"+ is_secondary_creation_str +"</span>";
				html_str += "       </p>";
				html_str += "   </div></div>";
				html_str += "   <button class='novel_select_btn' data-novel_no='"+novel_no+"' style='margin-top: 10px; ' >선택하기</button>";
				html_str += "</div>";
			}
			html_str += "				</p>";
			html_str += "			</div>";
			html_str += "		</div>";
			html_str += "	</div>";
			html_str += "</div>";


			if(novel_list.length != 0) {
				$("body").append(html_str) ;
				$("#novel_search_modal").modal();

			} else {
				alert("검색 내역이 없습니다.");
			}
		}

		$("#novel_search_modal").modal("hide");

		modal_novel_search(search_text);
		$(document).off("click", "#novel_search_modal .novel_select_btn");
		$(document).on("click", "#novel_search_modal .novel_select_btn", function () {
			var novel_no = $(this).data("novel_no") ;
			var data = g_novel[novel_no] ;

			if(data.novel_no) {
				if(typeof select_btn_event_cb == 'function'){

					select_btn_event_cb(data) ;
				}
			}else {
				select_btn_event_cb({}) ;
			}
			$("#novel_search_modal").modal("hide");
		});

	}

	// android 외부링크
	function gotoOutlink(_url){
		window.novelpia.load_outside_url(_url);
	}

	// 소설 검색 
	function novel_search_modal2(p_search_text, p_data, select_cb) {
		p_search_text = p_search_text || "";
		p_data = p_data || {};
		var g_novel = {} ;
		var g_page = 1;             // 현재 페이지
		var g_search_text = p_search_text;  // 검색 데이터
		var g_total_cnt = 0 ;       // 총 데이터 갯수
		var g_total_page = 0 ;      // 총 페이지 갯수
		const g_rows = 20 ;         // 한 페이지 데이터 갯수

		const jquery_ev_init = function () {
			$(document).off("click", "#novel_search_modal .novel_select_btn");
			$(document).on("click", "#novel_search_modal .novel_select_btn", fn_jquery_ev_obj.novel_select) ;

			$(document).off("click", "#novel_search_modal .basic-modal-close");
			$(document).on("click", "#novel_search_modal .basic-modal-close", fn_jquery_ev_obj.modal_close) ;

			$(document).off("click", "#novel_search_modal #novel_search_btn");
			$(document).on("click", "#novel_search_modal #novel_search_btn", fn_jquery_ev_obj.novel_search) ;

			$(document).off("keyup", "#novel_search_modal #search_txt");
			$(document).on("keyup", "#novel_search_modal #search_txt", function (e) {
				if(e.keyCode == 13) {
					fn_jquery_ev_obj.novel_search(e) ;
				}
			}) ;

			$(document).off("click", "#novel_search_modal .prev_btn");
			$(document).on("click", "#novel_search_modal .prev_btn", fn_jquery_ev_obj.prev_page) ;

			$(document).off("click", "#novel_search_modal .next_btn");
			$(document).on("click", "#novel_search_modal .next_btn", fn_jquery_ev_obj.next_page) ;

		}

		const fn_jquery_ev_obj = {
			novel_select : function () {            // 소설 검색
				var novel_no = $(this).data("novel_no") ;
				var data = g_novel[novel_no] ;
				if(data.novel_no) {
					if(typeof select_cb == 'function'){
						select_cb(data) ;
					}
				}else {
					select_cb({}) ;
				}
				// $("#novel_search_modal").modal("hide");
				// $("#novel_search_modal").modal("hide");
				fn_obj.modal_remove();
			},
			modal_close : function () {
				fn_obj.modal_remove();
			},
			novel_search : function () {
				const search_txt = $("#search_txt").val();
				g_page = 1;

				fn_obj.novel_search(search_txt, g_page, p_data);
			},
			prev_page : function () {
				if(g_page <= 1) {
					return ;
				}
				g_page--;
				//fn_obj.page_setting();
				fn_obj.novel_search(g_search_text, g_page, p_data) ;
			},
			next_page : function () {
				g_page++;
				//fn_obj.page_setting();
				fn_obj.novel_search(g_search_text, g_page, p_data) ;
			}
		}

		const fn_obj = {
			page_setting : function () {
				if(g_page == 1) {
					$("#novel_search_modal .prev_btn").prop("disabled", "disabled") ;
				}else {
					$("#novel_search_modal .prev_btn").prop("disabled", false) ;
				}
				$("#page_idx").html(g_page) ;

				g_total_page = Math.floor(g_total_cnt / g_rows) + 1 ;
				if(g_total_page <= g_page) {
					$("#novel_search_modal .next_btn").prop("disabled", "disabled") ;
				} else {
					$("#novel_search_modal .next_btn").prop("disabled", false) ;
				}

			},
			modal_remove : function () {        // modal 닫기
				$("#novel_search_modal").remove();
			},
			novel_search : function (search_text, page , data) {    // 소설 검색
				data = data || {} ;
				const that = this;
				// fn_obj.page_setting();
				g_search_text = search_text;
				$("#novel_search_modal .novel_seach_txt").text(search_text) ;
				fn_ajax_obj.novel_search(search_text, page, data, function (data) {
					const {list, total_cnt} = data ;
					if(total_cnt != undefined) {
						g_total_cnt = total_cnt;
					}
					const novel_list_html = that.novel_search_html(list) ;
					that.novel_list_content_innerhtml(novel_list_html) ;
					fn_obj.page_setting();
				}) ;
			},
			modal_html : function (novel_name) {
				let html_str = "";
				html_str += `
                <div class="basic-modal-background " id="novel_search_modal" >
                    <div class="basic-modal-wrapper " style="max-width: 450px; ">
                        <div class="basic-modal-top" style="padding-bottom: 11px;border-bottom: 1px solid #DDD;margin-bottom: 20px;">
                            <div class="basic-modal-name" style="text-align: left;font-size: 16px;font-weight: 600;">검색</div>
                            <div class="basic-modal-close"></div>
                        </div>
                        <div class="basic-modal-contents " >
                            <div class="input-group" style="margin-bottom: 30px;gap: 5px;">
                                <input type="form-contrl" style="width: 100%;border: 1px solid #DDD;padding: 9px 15px;font-size: 14px;" id='search_txt' placeholder="작품명, 작가명을 검색하세요" value="${novel_name}">
                                <div class="input-group-append">
                                    <button type="button" class="btn text-white " id='novel_search_btn' style="background: black">검색</button>
                                </div>
                            </div>
                            <div style="margin-bottom: 12px;">
                                <font style="font-size:15px;">
                                    <b style="color:#5032df;" class="novel_seach_txt">${g_search_text}</b> 검색 결과 입니다.
                                </font>
                            </div>
                            <!--
                            <div class="row" style="margin-bottom: 12px;">
                                <div style="font-size: 16px;font-weight: 500; padding-top: 5px" class="col-4">
                                    검색 결과
                                </div>
                            </div>
                            -->
                            <div id="novel_list_content" style="height: 500px; overflow-y: auto;overflow-x: hidden;background-color: #F6F6F6; padding: 16px;">

                            </div>
                            <div class="row " style="margin-top: 10px; ">
                                <div style="" class="col-12 text-center ">
                                    <span>
                                        <button type="button" class="btn btn-xs btn-default prev_btn"  >이전</button>
                                        <span style="padding: 0 10px; font-size: 14px;font-weight: 500;">
                                            <span id="page_idx">${g_page}</span> PAGE
                                        </span>
                                        <button type="button" class="btn btn-xs btn-default  next_btn">다음</button>
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                `;
				return html_str ;
			},
			append_modal : function (html_str) {        // modal show
				$("body").append(html_str) ;
				$("#novel_search_modal").show();
			},
			novel_search_html : function (list) {      // 검색 결과 html
				var html_str = "";
				var novel_list = list ;
				if(novel_list.length == 0 ){
					// alert("검색 내역이 없습니다.");
					// if( 1 < g_page) {
					//     g_page-- ;
					//     fn_obj.page_setting();
					// }
					return "";
				}

				for (var i = 0; i < novel_list.length; i++) {
					var d = novel_list[i] ;
					var novel_no = d.novel_no ;
					var novel_name = d.novel_name ;
					var mem_nick = d.mem_nick ;
					var writer_nick = d.writer_nick;
					var is_secondary_creation = d.is_secondary_creation ;
					var is_secondary_creation_str =  is_secondary_creation == 1 ? "2차 창작 허용" : "";
					var novel_thumb = d._novel_thumb || "//image.novelpia.com/img/layout/ready2.jpg" ;
					g_novel[novel_no] = d ;

					html_str += "<div style='display: flex;margin-bottom: 20px;gap: 15px;'>";
					html_str += "   <img src='"+novel_thumb+"' alt='"+novel_name+"' title='"+novel_name+"' style='max-width: 80px;flex: 1;min-width: 0;'>";
					html_str += "   <div style='display: flex;flex-direction: column;justify-content: space-between;flex: 1;min-width: 0;'>";
					html_str += "       <div>";
					html_str += "           <p title='"+novel_name+"' style='overflow: hidden;text-overflow: ellipsis;white-space: normal;line-height: 1.3;text-align: left;word-wrap: break-word;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;font-size: 15px;font-weight: 500;color: #000;'>"+ novel_name +"</p>";
					html_str += "           <p style='font-size: 13px;color: #666;margin: 4px 0px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;' title='"+writer_nick+"'>"+ writer_nick +"</p>";
					html_str += "           <p class='is_second_allow' style='color: #4B7CAE;font-size: 12px;'>"+ is_secondary_creation_str +"</p>";
					html_str += "       </div>";
					html_str += "       <button class='novel_select_btn' data-novel_no='"+novel_no+"' style='background-color: #FFF;border: 1px solid #DDD;padding: 6px 15px;color: #666;font-size: 12px;cursor: pointer;max-width: 80px;'>선택하기</button>";
					html_str += "   </div>";
					html_str += "</div>";
				}
				return html_str ;
			},
			novel_list_content_innerhtml : function (html) {
				$("#novel_list_content").html(html) ;
			}
		}

		const fn_ajax_obj = {
			novel_search : function  (search_text, page,  data, callback ) {
				page = page || 1 ;
				data.page = page ;
				data.search_text = search_text ;
				data.rows = g_rows ;
				$.ajax({
					type: 'get'
					, url: '/proc/novelsearch_v2/'
					, data : data
					, cache: false
					, success: function(data) {
						_dev.log(data);
						const {status, novel_search } = data;

						if(status == 200) {
							//novel_search_html_make(data.data) ;
							if(typeof callback == 'function') {
								callback(novel_search) ;
							}
						} else {
							var err_msg = data.errmsg || "연동 오류 ";
							alert(err_msg) ;


						}
					}
					, error: function(data, status, err){
					}
					, beforeSend : function () {
						$('.loads').show();
					}
					, complete: function(){
						$('.loads').hide();
					}
				});
			}
		}


		const init = function () {
			const modal_html = fn_obj.modal_html(p_search_text) ;
			fn_obj.append_modal(modal_html) ;

			if(p_search_text != "") {
				fn_obj.novel_search(p_search_text, 1, p_data, select_cb) ;
			}
			jquery_ev_init() ;
		}
		init() ;
	}

	/**
	 * 개발용 함수
	 * @returns {{log: log, alert: alert, error: error, info: info}}
	 */
	function Devmode () {
		const url = new URL(location) ;
		const hostname = url.hostname || "" ;
		//const is_dev = hostname == "dev.novelpia.com" ;
		const test_server = ["dev.novelpia.com", "ts.novelpia.com", "stage.novelpia.com", "stages.novelpia.com", "local.novelpia.com"];
		const is_dev = test_server.includes(hostname);

		return {
			log : function () {
				const args = R.map(R.identity, arguments) ;
				if(!is_dev) {
					return ;
				}
				console.log.apply(this, args) ;
			},
			error : function () {
				const args = R.map(R.identity, arguments) ;
				if(!is_dev) {
					return ;
				}
				console.error.apply(this, args) ;
			},
			info : function () {
				const args = R.map(R.identity, arguments) ;
				if(!is_dev) {
					return ;
				}
				console.info.apply(this, args) ;
			},
			alert : function (msg) {
				if(!is_dev) {
					return ;
				}
				alert(msg);
			}
		}
	}
	var _dev = new Devmode();

	function http(type, url, data, headers, opt)  {
		data = data || {} ;
		headers = headers || {} ;
		opt = opt || {};
		cache = opt.cache || false;
		xhrFields = opt.xhrFields || {};
		return new Promise( (resolve) => {
			$.ajax({
				type: type,
				url: url,
				cache: cache,
				data: data,
				xhrFields: xhrFields,
				headers : headers, 
				success: function (data) {
					resolve(data);
				},
				error: function (request, status, error) {
					resolve({});
				}
			})
		} )
	}

	/**
	 * 파일 업로드
	 * const form = new FormData() ;
	 * form.append("data", file)
	 * @author sklee
	 * @param form  FormData
	 * @returns {Promise}  OK|URL|FILE_NAME
	 */
	const http_file_upload = function (form) {
		$('.loads').show();
		return new Promise( (resolve) => {
			$.ajax({
				data: form,
				type: "POST",
				url: "/proc/upload_image",
				cache: false,
				contentType: false,
				processData: false,
				success: function(data) {
					resolve(data)
				},
				complete: function(){
					$('.loads').hide();
				},
				error: function (request, status, error) {
					resolve({});
				}
			});
		})
	}
	/**
	 * 파일 업로드
	 * const form = new FormData() ;
	 * form.append("data", file)
	 * @author sklee
	 * @param form  FormData
	 * @returns {Promise}  OK|URL|FILE_NAME
	 */
	const http_file_upload2 = function (url, form) {
		$('.loads').show();
		return new Promise( (resolve) => {
			$.ajax({
				data: form,
				type: "POST",
				url: url,
				cache: false,
				contentType: false,
				processData: false,
				success: function(data) {
					resolve(data)
				},
				complete: function(){
					$('.loads').hide();
				},
				error: function (request, status, error) {
					resolve({});
				}
			});
		})
	}


	const novel_cover_img = function (p_url) {
		const default_img = "//images.novelpia.com/old/img/layout/readycover4.png";
		const getImg = (img_url) => new Promise((resolve, reject) => {
			const image = new Image() ;
			image.src = img_url
			image.onload = function () {
				resolve(image)
			}
			image.onerror = function () {
				resolve({})
			}
		});

		const main = async function (url) {
			// webp 가 있는지 체크
			if(!url) {
				return default_img ;
			}
			const webp_url = url.replace(".file", ".wimg") ;
			const webp_img = await getImg(webp_url) ;
			if(webp_img.src) {
				return webp_img.src ;
			}
			return url;
		};
		return main(p_url) ;
	}

	/**
	 * 메인 태그 검색
	 * @param config {}
	 */
	const fn_main_genre = (config) => {
		const g_opt = {
			main_genre_selector : config.main_genre_selector || ".genre-box-wrapper" ,
			tap : config.tap || "all",
			tag : config.tag || "" ,						// default 태그
			main_genre : config.main_genre || "" ,			// default 메인 태그
			main_genre_obj : config.main_genre_obj || {},   // 메인 태그 obj
			adt_mode : config.adt_mode || 0,				// 성인 여부
			adult_main_genre_arr : config.adult_main_genre_arr || [], // 성인 태그 array
			nav_item_click : config.nav_item_click || null,     // 메인 태그 클릭 이벤트 함수
			tag_search_event : config.tag_search_event || null,  // 검색 태그 이벤트 함수
			fn_main_genre_list_filter : config.fn_main_genre_list_filter || R.T  // 메인 태그 필터 함수
		};

		const jquery_ev_init = (opt) => {
			const $seletor = opt.main_genre_selector ;
			$($seletor).off("click", ".nav-item ") ;
			$($seletor).on("click", ".nav-link ", fn_jquery_ev_obj.nav_item_click) ;

			$($seletor).off("click", ".btn_genre_search_modal_btn ") ;
			$($seletor).on("click", ".btn_genre_search_modal_btn ", fn_jquery_ev_obj.modal_tag_show) ;

			$(document).off("click", "#genre_search_modal_close_btn");
			$(document).on("click", "#genre_search_modal_close_btn", fn_jquery_ev_obj.genre_search_modal_close_btn_click) ;
			$(document).off("click", "#genre_search_modal .basic-modal-close");
			$(document).on("click", "#genre_search_modal .basic-modal-close", fn_jquery_ev_obj.genre_search_modal_close_btn_click);


			$(document).off("click", "#genre_search_btn") ;
			$(document).on("click", "#genre_search_btn", fn_jquery_ev_obj.genre_search) ;

			$(document).off("keyup", "#genre_search");
			$(document).on("keyup", "#genre_search", function (e) {
				if(e.keyCode==13) {
					fn_jquery_ev_obj.genre_search(e) ;
				}
			});

			$(document).off("click", "#genre_search_modal .user_search_tag");
			$(document).on("click", "#genre_search_modal .user_search_tag", fn_jquery_ev_obj.user_search_tag_click);
		}

		// jquery 이벤트
		const fn_jquery_ev = (opt) => {
			return {
				nav_item_click : (e) => {
					const {target} = e ;
					const {nav_item_click, main_genre_selector} = opt ;
					const main_genre = target.dataset.main_genre ;
					if(R.type(nav_item_click) == "Function"){
						nav_item_click(e) ;
					}
					fn_html_obj.main_genre_active(main_genre_selector, target) ;
					opt.main_genre = main_genre ;
					opt.tag = "";
				},
				modal_tag_show : (e) => {
					fn_html_obj.modal_tag_inner_html();
					fn_html_obj.genre_search_history_html();

					fn_html_obj.modal_tag_show() ;

				},
				genre_search_modal_close_btn_click : (e) => {
					fn_html_obj.genre_search_modal_hide();  // 모달 닫기
				},
				genre_search : (e) => {
					let genre_search = $("#genre_search").val() || "";
					if(genre_search == "" ) {
						alert("검색어를 입력하세요.") ;
						return ;
					}
					genre_search = genre_search.toUpperCase();
					fn_obj.set_genre_search_history(genre_search) ; // 데이터 저장
					fn_html_obj.genre_search_modal_hide();  // 모달 닫기
					opt.main_genre = ""; // 메인 태그 초기화
					// 이벤트 함수 동작
					const {tag_search_event, main_genre_selector} = opt ;
					if(R.type(tag_search_event) == "Function") {
						tag_search_event(genre_search) ;
					}
					fn_html_obj.tag_search(main_genre_selector) ;
				},
				user_search_tag_click : (e) => {
					fn_html_obj.genre_search_modal_hide();
					const {target} = e;
					const tag = target.dataset.tag || "" ;
					// 이벤트 함수 동작
					const {tag_search_event, main_genre_selector} = opt ;
					if(R.type(tag_search_event) == "Function") {
						tag_search_event(tag) ;
					}
					opt.main_genre = ""; // 메인 태그 초기화
					fn_html_obj.tag_search(main_genre_selector) ;
				}
			}
		}
		const fn_jquery_ev_obj = fn_jquery_ev(g_opt);

		// 공통 함수
		const _fn_obj = (opt) => {
			return {
				/* 모달 태그 관리 */
				set_genre_search_history: function (genre) {
					if(is_secret_mode() == '1'){
						return false;
					}
					let genre_search_history_arr = this.get_genre_search_history();
					if(!R.type(genre_search_history_arr) == "Array") {
						genre_search_history_arr = [] ;
					}
					genre_search_history_arr.unshift(genre) ;
					genre_search_history_arr = R.uniq(genre_search_history_arr) ;
					genre_search_history_arr = genre_search_history_arr.splice(0, 5) ;
					const genre_search_history_txt = JSON.stringify(genre_search_history_arr);
					localStorage.setItem("genre_search_history", genre_search_history_txt);
				},
				get_genre_search_history : function () {
					const genre_txt =  localStorage.getItem("genre_search_history") ;
					if(R.type(genre_txt) != "String") {
						return [] ;
					}
					const result = JSON.parse(genre_txt);
					const result1 = R.type(result) == "Array" ? result : []  ;
					if(result1.length == 0 ) {
						$("#no_genre_search_history").show() ;
					} else {
						$("#no_genre_search_history").hide() ;
					}
					return result1;
				},

				del_genre_search_history : function (i){
					const genre_list = this.get_genre_search_history();
					const list = R.remove(i, 1, genre_list) ;
					const list_txt = JSON.stringify(list);
					localStorage.setItem("genre_search_history", list_txt);
				},
				/* // 모달 태그 관리 */
			}
		}
		const fn_obj = _fn_obj(g_opt) ;

		// html 함수
		const _fn_html_obj = (opt) => {
			return {
				main_genre_html : () => {
					const {
						main_genre,
						main_genre_obj,
						tag,
						adt_mode,
						adult_main_genre_arr,
						main_genre_selector,
						fn_main_genre_list_filter
					}  = opt;
					const list_html = R.pipe(
						// obj => array
						(obj)=> {
							const result = []  ;
							for (const key in obj) {
								const value = obj[key] ;
								result.push({
									key, value
								})
							}
							return result;
						},
						// 순서 변경
						R.reduce((acc, iter) => {
							const arr = [1,2,3,6,12,13,5,14,9,8,7,10,11];
							const {value , key} = iter ;
							const index = R.indexOf(Number(key), arr ) ;
							if(index != -1 ) {
								acc[index] = iter;
							}
							return acc ;
						}, []),
						R.filter((item) => {
							if(R.type(fn_main_genre_list_filter)  == "Function") {
								if(!fn_main_genre_list_filter(item)) {
									return false;
								}
							}
							if(item == "미정") {
								return false ;
							}
							if(adt_mode == 0 && R.includes(item, adult_main_genre_arr) ) {
								return false;
							}
							return true;
						}),
						R.map((item) => `
							<li class='nav-item '>
								<a 
									class='nav-link main_genre_tag all_tag 
										${item.key == main_genre ? "active" : ""}
									' 
								 	role='tab' data-main_genre='${item.key}'
								>
									${item.value}
								</a>
							</li>`
						),
						R.values,
						R.join("")
					)(main_genre_obj);

					let all_active = "";
					if(main_genre == "" && tag == "") {
						all_active = "active";
					}

					let html = `
                    <ul class="nav nav-pills flex-column flex-md-row genre-box main-genre-box" role="tablist">
                        <li class="nav-item">
                            <button type="button" class="btn_genre_search btn_genre_search_modal_btn" >태그검색</button>
                        </li>
                        <li class='nav-item '>
                            <a class='nav-link main_genre_tag all_tag ${all_active}' role='tab' data-main_genre=''>
                                전체
                            </a>
                        </li>
                        ${list_html}
                    </ul>
                    `;
					$(main_genre_selector).html(html) ;
				},
				main_genre_active : (main_genre_selector, target) => {
					$(main_genre_selector + " .nav-link").removeClass("active") ;
					$(target).addClass("active") ;
				},

				modal_tag_inner_html : () => {
					const CDN_DOMAIN_IMG = "//image.novelpia.com" ;
					const html = `
                    <div class="basic-modal-background" id="genre_search_modal" >
                        <div class="basic-modal-wrapper">
                            <div class="basic-modal-top">
                                <div class="tab_search_tit">태그 검색</div>
                                <div class="basic-modal-close"></div>
                            </div>
                            <div class="tag_contents">
                                <input type="text" id="genre_search" class="tag_search_box" value="" placeholder="검색할 태그를 입력해주세요.">
                                <h6>최근 검색 목록 </h6>
                                <div class="history_box">
                                    <ul id="genre_search_history">
                                    </ul>
                                </div>
                                <div class="history_box tag_no_pia" id="no_genre_search_history">
                                    <img src="${CDN_DOMAIN_IMG}/img/new/list/img_tag_x.png">
                                    최근 검색 기록이 없습니다.
                                </div>
                                <div class="tab_search_footer">
                                    <button type="button" class="tag_search" id="genre_search_btn">검색</button>
                                    <button type="button" class="pop_close" id="genre_search_modal_close_btn" >닫기</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
					$("body").append(html) ;

				},
				modal_tag_show : () => {
					$("#genre_search_modal").show();
				},

				genre_search_history_html : function () {
					let html = "";
					const genre_search_history_arr = fn_obj.get_genre_search_history();
					for (let i = 0; i < genre_search_history_arr.length ; i++) {
						const item = genre_search_history_arr[i] ;
						html += `
                    <li>
                        <a class='user_search_tag' data-tag="${item}">${item}</a>
                        <div style="display:inline-block; float:right;">
                            <span class="genre_fix" id="fix_genre_${i}"></span>
                            <span class="genre_tag_del" data-i="${i}">
                                <i class="icon ion-trash-a" style="font-size:20px; line-height: 20px;"></i>
                            </span>
                        </div>
                    </li>`;
					}
					$("#genre_search_history").html(html) ;
				},
				genre_search_modal_hide : function () {
					$("#genre_search_modal").remove();
				},

				tag_search : function (main_genre_selector) {
					// 메인 태그 active 삭제
					$(main_genre_selector + " .nav-link").removeClass("active") ;
				}
			}
		}
		const fn_html_obj = _fn_html_obj(g_opt) ;

		const _init = (opt) => {
			jquery_ev_init(opt);
			fn_html_obj.main_genre_html() ;
		}
		_init(g_opt);
	} ;
	/**
	 * 외부 링크 이동
	 * @param link_url
	 * @param type
	 * @returns {Promise<void>}
	 */
	const out_site_go = async (link_url, type ) => {
		// debugger
		type = type || 1 ;
		const checkUrlForm = (_url) =>  /^http[s]?\:\/\//i.test(_url) && !/^https?:\/\/chatple\.novelpia\.com/i.test(_url) ;

		if(!checkUrlForm(link_url)) {
			location = link_url ;
			return ;
		}
		// const url = new URL(link_url) ;
		// const {origin} = url ;
		// const site_url = origin ;
		//
		// const data = {
		// 	mode : "out_link_save" ,
		// 	link_url,
		// 	site_url
		// }
		// const http_url = "/proc/main";
		//
		// const http_data = await http("post", http_url, data ) ;
		// const {status, errmsg = '연동 오류'} = http_data ;
		if(type == 0 ) {
			location = link_url ;
		} else if(type == 1 ) {
			// window.open(link_url) ;
			_gotoOutlink(link_url);
		}
	}

	const banner_link_go = async (idx, link ) => {
		const data = {
			cmd : "banner_cnt" ,
		}
		const http_url = "/proc/banner";

		const http_data = await http("post", http_url, data ) ;
		const {status, errmsg = '연동 오류'} = http_data ;

		const checkUrlForm = (_url) =>  /^http[s]?\:\/\//i.test(_url) ;
		if(!checkUrlForm(link)) {
			location = link ;
			return ;
		}

		// const url = new URL(link) ;
		// const {origin} = url ;
		// const site_url = origin ;

		// _gotoOutlink(link);
	}

	
	String.prototype.format = function(){
		var num = parseFloat(this);
		if( isNaN(num) ) return "0";

		return num.format();
	};
	Number.prototype.format = function(){
		if(this==0) {return 0;}
		var reg = /(^[+-]?\d+)(\d{3})/;
		var n = (this + '');

		while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');

		return n;
	};

	/**
	 * 날짜 표시
	 * @param date_time
	 * @returns {string|string}
	 */
	const date_time_txt = (date_time) => {
		const now = moment() ;
		const _date_time = moment(date_time) ;

		const now_yyyy = now.format("YYYY") ;
		const _datetime_yyyy = _date_time.format("YYYY") ;

		const _seconds = now.diff(_date_time, "seconds") ;
		const date_format = _date_time.format("YY.MM.DD") ;
		const date_format2 = _date_time.format("MM.DD") ;
		const years = Math.abs(now.diff(_date_time, "years"));
		const months = Math.abs(now.diff(_date_time, "months"));
		const date = Math.abs(now.diff(_date_time, "date"));
		const hours = Math.abs(now.diff(_date_time, "hours"));
		const minutes = Math.abs(now.diff(_date_time, "minutes"));
		const seconds = Math.abs(now.diff(_date_time, "seconds"));

		const  result = seconds < 60 ? seconds + "초"
						: minutes < 60 ? minutes + "분"
						: hours < 24 ? hours + "시간"
						: date < 3 ? date + "일"
						: now_yyyy == _datetime_yyyy ? date_format2
						: date_format
		;

		return  24 <= hours ? result
					: 0 < _seconds ? result + "전"
					: _seconds < 0 ? result + "후"
					: "방금전"
		;
	};

	const is_secret_mode = () => {
		return $.cookie('secret_mode');
	}
    // String.prototype.ln2br = function () {
    //     console.log(this);
    //     return this.replace(/\n/g, "<br />");
    // }

    const nl2br = (str) => {
        return str.replace(/\n/g, "<br />");
    }

	String.prototype.notag = function () {
		return this.replace(/(<([^>]+)>)/ig,"");
	}

    const call_toast_msg = (msg , toast_fn) => {

        // 요소 만들기 부분
        const new_element = document.createElement("div");
        const text_node = document.createTextNode(msg);
        const css_text = `position: fixed;
                          top: 10%;
                          left: 50%;
                          background-color: #262626;
                          color: #FFF;
                          width: 60%;
                          transform: translate(-50%, -50%);
                          z-index: 9999;
                          text-align: center;
                          padding: 8px 5px;
                          font-size: 15px;
                          border-radius: 5px;
                          opacity: 0;
                          transition: opacity 1s ease 0s;
                          `;

        new_element.appendChild(text_node);
        new_element.classList.add('toast_box');
        new_element.classList.add('s_inv');
        new_element.style.cssText = css_text;
        document.body.appendChild(new_element);

        //애니메이션 실행 부분
        setTimeout(() => {
            document.querySelector(".toast_box").style.opacity='1'; //in
        }, 100);
        setTimeout(() => {
            document.querySelector(".toast_box").style.opacity='0'; //out
        }, 3000);


        if(typeof toast_fn === "function") {
            toast_fn();
        }
    }

//ios 모달 부분
let g_alert_cb = null ;

const fn_alert = (msg, cb) => {
    //존재여부 체크
    if(document.querySelector(".alert_box_bg") !== null){
        document.querySelector(".alert_box p").innerText = msg;
        document.querySelector(".alert_box_bg").style.display = "block";

        g_alert_cb = cb ;
        document.querySelector(".alert_ok").setAttribute('onclick','fn_alert_ok()');
        return;
    }

    //요소 구성
    const back = document.createElement("div");
    back.classList.add('alert_box_bg');

    //모달백그라운드
    const back_css = `position: fixed;
                      width: 100%;
                      height: 100%;
                      background: rgba(0,0,0,0.5);
                      top: 0;
                      left: 0;
                      z-index: 9999;
    `;
    back.style.cssText = back_css;

    //모달창 구현
    const ch_node = document.createElement("div");
    const modal_box = back.appendChild(ch_node);
    ch_node.classList.add('alert_box');

    const modal_css = ` margin: 0px auto;
                        top: 50%;
                        transform: translateY(-50%);
                        max-width: 300px;
                        width: 90%;
                        padding: 23px;
                        background: rgb(255, 255, 255);
                        z-index: 10;
                        position: relative;
                        border: 1px solid #000;
    `;
    ch_node.style.cssText = modal_css;

    //모달 메세지 붙이기
    const ch_text_p = document.createElement("p");
    const ch_text = modal_box.appendChild(ch_text_p);
    ch_text_p.style.cssText = `text-align: center;`;

    ch_text_p.textContent += msg;

    //확인 버튼 만들기
    const ch_btn_el = document.createElement("div");
    const ch_btn = modal_box.appendChild(ch_btn_el);
    ch_btn_el.textContent += "확인";
    ch_btn_el.classList.add('alert_ok');

    const ok_css = `margin-top: 20px;
                    color: rgb(255, 255, 255);
                    cursor: pointer;
                    background-color: rgb(118, 50, 255);
                    padding: 5px 8px;
                    text-align: center;
                    background-color: #000;
    `;

    ch_btn_el.style.cssText = ok_css;

    //add body
    document.body.appendChild(back);

    g_alert_cb = cb ; 

    //add ev
    ch_btn_el.setAttribute('onclick','fn_alert_ok()');
}

const fn_alert_ok = () => {
    if(typeof g_alert_cb !== 'function') {
        document.querySelector(".alert_box_bg").style.display = "none";
        return ;
    }
    g_alert_cb() ; 
    document.querySelector(".alert_box_bg").style.display = "none";
}
/**
 * img 파일 사이즈
 * @author sklee
 * @param url
 * @returns {Promise}
 */
const fn_img_size_data = (url) => new Promise((resolve, reject) => {
	const img = new Image() ;
	img.onload = function () {
		resolve({
			width: this.width,
			height : this.height
		})
	}
	img.src = url ;
});

var get_config = async (path_arr) => {
	if(R.type(path_arr) !== "Array") {
		return [] ;
	}
	const url = "/proc/config";
	const data = {
		cmd : "get_config",
		path_arr : path_arr
	}
	const http_result = await http("GET", url, data) ;
	const {config = {}} = http_result

	return config;
};

const fn_novel_reading_time = async () => {
	
	const read_time = Number(sessionStorage.getItem("read_time")) ;
	if(read_time === 0 ) {
		return ;
	}
	const url = "/proc/novel_viewer";
	const params = {
		cmd : "read_time",
		sec : read_time
	}
	const http_result = await http("post", url, params) ;
	sessionStorage.setItem("read_time", "") ;
}

function deletetag(input, allow) {
	var regExp;
	if(allow.length !=0) {
		regExp = "<\\/?(?!(" + allow.join('|') + "))\\b[^>]*>";
	}
	else {
		regExp = "<\/?[^>]*>";
	} 
	return input.replace(new RegExp(regExp, "gi"), "");
}

var inc_stat = async function (stat_name, data) {
	data = R.type(data) === "Object" ? data : {} ;
	const url = "/proc/stat";
	data.cmd = `inc_${stat_name}`;
	const http_data = await http("post", url, data) ;
	return ; 
}


var fn_android = {
	set_cookie : function (name, value , expires) {
		expires = expires || 365;
		$.cookie(name, value, { expires: expires, path: '/', domain: '.novelpia.com', secure: false });
	},
	get_cookie : function (name) {
		return $.cookie(name) || ""
	},
	set_localStorage : function (name, value ) {
		if(!name ) {
			return ;
		}
		localStorage.setItem(name, value) ;
	},
	get_localStorage : function (name) {
		return localStorage.getItem(name) || "" ;
	},
	app_call :  (fn_name) => {
		const {novelpia} = window || {};
		const default_fn = () => {
		};
		return R.propOr(default_fn, fn_name, novelpia)() ;
	}
}

function get_cdn_url (str) {
	return R.pipe(
		val => R.type(val) === "String" ? [val] : [] ,
		R.map(val => R.includes(G_OLD_CDN_DOMAIN_IMG, val) ? R.replace(G_OLD_CDN_DOMAIN_IMG, G_CDN_DOMAIN_IMG2, val) : val),
		R.map(val => R.includes(G_CDN_DOMAIN_IMG2, val) ?  val : G_CDN_DOMAIN_IMG2+val),
		R.propOr(str, 0)
	)(str)
}

function vue_load (str, version) {
	version = version || moment().unix();
	return httpVueLoader(`${str}?version=${version}`);
};

const _load_arr = [] ;
const fn_load = () => {

	const css_load = (url, version) => {
		if(R.includes(url, _load_arr)) {
			return ;
		}

		_load_arr.push(url) ;
		version = version || moment().unix();
		return  new Promise((res, rej) => {

			const link = document.createElement("link");
			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = url + "?version=" + version;
			document.head.appendChild(link);
			link.onload = res;
			link.onerror = rej;
		})
	}
	const js_load = (url, version) => {
		if(R.includes(url, _load_arr)) {
			return ;
		}
		_load_arr.push(url) ;
		version = version || moment().unix();
		return new Promise((resolve, reject) => {
			const script = document.createElement("script");
			script.setAttribute("src", url + "?version=" + version) ;
			script.onload = resolve;
			script.onerror = reject;
			document.head.appendChild(script);
		});
	}
	const vue_load = (str, version) => {
		version = version || moment().unix();
		return httpVueLoader(`${str}?version=${version}`);
	}

	return {
		js_load,
		css_load,
		vue_load
	}
}

const util = {
	delay : (sec) => new Promise((resolve) => setTimeout(resolve, sec * 1000)),
}