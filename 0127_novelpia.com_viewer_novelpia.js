    let viewer_screen_height;

	function btn_comment() {
		if(location.hash == '#comments') {
			history.go(-1);
		} else if(location.hash == '#' || location.hash == '') {
			location.hash = 'comments';
		} else {
			location.replace('#comments');
		}
	}

	function btn_list(st) {
		if(location.hash == '#lists') {
			history.go(-1);
		} else if(location.hash == '#' || location.hash == '') {
			location.hash = 'lists';
		} else {
			location.replace('#lists');
		}
	}

	function episode_list_viewer(page) {

		$.ajax({
            data: { "novel_no": $('#novel_no').val(), "sort" : localStorage['novel_sort_' + $('#novel_no').val()],
            "page" : localStorage['novel_page_' + $('#novel_no').val()] },
			type: "POST",
			url: "/proc/episode_list_viewer",
			cache: false,
			success: function(data) {
				$('#episode_list_viewer').html(data);
				if($.cookie('DARKMODE') == 1) {
					$('#list_box .b_19').css("filter", "invert(1)");
					$('#list_box .b_free').css("filter", "invert(1)");
					$('#list_box .b_plus').css("filter", "invert(1)");
					$('#list_box .b_comp').css("filter", "invert(1)");
					$('#list_box .b_mono').css("filter", "invert(1)");
					$('#list_box .b_cont').css("filter", "invert(1)");
				}
	   		    $('#list_box').animate({ scrollTop: 0 }, 0);
			}
		});

	}

	function btn_list_on(st) {
        if($('#footer_bar').is(":visible") == false){
            $('#footer_bar').show();
            $('#header_bar').show();
            $('#float-menu').show();
        }
		$('#scroll_up_btn').hide();
		$('#scroll_down_btn').hide();
				//console.log("#scroll_down_btn - hide3;");
		$('#navigation_group').hide();
		episode_list_viewer(0);
		option_btn_list = 1;
		option_btn_comment = 0;
		option_btn_theme = 0;
		$('#btn_list').attr('src', '/img/new/viewer/btn_list_on.png');
		$('#btn_comment').attr('src', '/img/new/viewer/btn_comment.png');
		$('#btn_theme').attr('src', '/img/new/viewer/btn_theme.png');
		$('#btn_comment_text').css("color", "#000");
		$('#comment_box').hide();
		$('#novel_box').hide();
		$('#theme_box').hide();
		$('#list_box').show();
	}

	function btn_list_off(st) {
		option_btn_list = 0;
		$('#btn_list').attr('src', '/img/new/viewer/btn_list.png');
		$('#btn_comment_text').css("color", "#000");
		$('#navigation_group').show();
		$('#novel_box').show();
		$('#comment_box').hide();
		$('#theme_box').hide();
		$('#list_box').hide();
	}


	function page_back() {
		if(move_key == 0) {
			move_key = 1;

			if(localStorage['viewer_paging'] != 1) {

				toggle_navi_animate_lock = 1;
				$('#novel_box').animate({ scrollTop: $('#novel_box').scrollTop() - $('#novel_box').innerHeight() - 35 }, animation_100, function() { move_key = 0; toggle_navi_animate_lock = 0; } );

			} else {
				this_page--;
				if(this_page < 1) { this_page = 1; }
				//localStorage['view_' + $('#content_no').val()] = this_page;
				$('#this_page_view').html(this_page);

				$('#novel_drawing_page_c').animate({
					scrollLeft: (page_width() * (this_page - 1))
				}, animation_100, function() { move_key = 0;
					$('#page_navigation').val(this_page).change();
					page_cal();
				});
				page_cal();

				if(toggle_navi == 0 && (option_btn_theme == 0) && (option_btn_comment == 0)) {

					$('#footer_bar').hide();
					$('#header_bar').hide();
					$('#theme_box').hide();
                    $('#float-menu').hide();
					//console.log("page_back - off");
					up_down_btn_view('off');
					toggle_navi = 1;

				}
			}

            updateMark();
		}
	}

	function page_next() {
		if(move_key == 0) {
			move_key = 1;
			if(localStorage['viewer_paging'] != 1) {
				toggle_navi_animate_lock = 1;
				$('#novel_box').animate({ scrollTop: $('#novel_box').scrollTop() + $('#novel_box').innerHeight() - 35 }, animation_100, function() {
					move_key = 0; toggle_navi_animate_lock = 0; } );

			} else {
				this_page++;
				if(this_page > max_page) { this_page = max_page;
					if(localStorage['viewer_nextepi'] == 'on' && $('#next_epi_auto_url').val() != '') {
						if($('#content_no_next').val() > 0) {
							// 정주행 방해되지 않도록
							//localStorage['view_' + $('#content_no_next').val()] = 1;
						}
						pageload($('#next_epi_auto_url').val(), 1);
					} else if(localStorage['viewer_nextepi'] == 'on') {
						alert("다음 등록 된 회차가 없습니다.");
					}
				}
				//localStorage['view_' + $('#content_no').val()] = this_page;
				$('#this_page_view').html(this_page);


				$('#novel_drawing_page_c').animate({
					scrollLeft: (page_width() * (this_page - 1))
				}, animation_100, function() { move_key = 0;
					page_cal();

					$('#page_navigation').val(this_page).change();
				});

				page_cal();




				if(toggle_navi == 0 && (option_btn_theme == 0) && (option_btn_comment == 0)) {
					$('#footer_bar').hide();
					$('#header_bar').hide();
					$('#theme_box').hide();
                    $('#float-menu').hide();
					//console.log("page_next - off");
					up_down_btn_view('off');
					toggle_navi = 1;
				}

			}

            updateMark();
		}
	}

    function getPageMark() {

        let lists = localStorage['page_mark'];
        let novel_no = $('#novel_no').val();
        let content_no = $('#content_no').val();

        if(lists) { // 로컬스토리지에 page_mark있을때
            lists = JSON.parse(lists);

            const filter_list = lists.filter(item => {
                return item.novel_no == novel_no;
            });

            if(filter_list.length > 0 && filter_list[0].epi_no == content_no && filter_list[0].novel_no == novel_no){ //같은 소설의 같은 에피소드 볼 때

                page_goto(filter_list[0].page);

            }else if(filter_list.length > 0 && filter_list[0].epi_no != content_no && filter_list[0].novel_no == novel_no){ //같은 소설의 다른 에피소드 볼 때
                
                page_goto(1);
                updateMarkEpi();
            
            }else{ //기존에 보던 작품 말고 새로운 작품 볼 때
                
                let arr = [{ "novel_no":novel_no, "epi_no":content_no, "page":this_page },...lists];

                if(lists.length > 100){ // 길이 100개 이상일경우
                    arr.pop();
                }
                localStorage['page_mark'] = [JSON.stringify(arr)];
                page_goto(this_page);
            }
        }else{ //page_mark자체가 없을때
            makePageMark();
        }
        
    }

    function makePageMark() {
        let mark = { "novel_no":$('#novel_no').val(), "epi_no":$('#content_no').val(), "page":this_page };
        localStorage['page_mark'] = JSON.stringify([mark]);
        page_goto(this_page);
    }

    function updateMark() {
        let lists = JSON.parse(localStorage['page_mark']);

        lists.filter(item => {
            if(item.novel_no == $('#novel_no').val()) {
                item.page = this_page
            }
        });

        localStorage['page_mark'] = [JSON.stringify(lists)];
    }

    function updateMarkEpi() {
        let lists = JSON.parse(localStorage['page_mark']);
        let novel_no = $('#novel_no').val();
        let content_no = $('#content_no').val();

        lists.filter(item => {
            if(item.novel_no == novel_no) {
                item.page = 1;
                item.epi_no = content_no;
            }
        });

        localStorage['page_mark'] = [JSON.stringify(lists)];
    }

	function page_goto(goto_page) {
		if(move_key == 0) {
			move_key = 1;
			if(localStorage['viewer_paging'] != 1) {
				toggle_navi_animate_lock = 1;
				$('#novel_box').animate({ scrollTop: ($('#novel_box').innerHeight() * (goto_page - 1)) }, animation_100, function() { toggle_navi_animate_lock = 0;
					move_key = 0;  } );
			} else {
				this_page = goto_page;
				if(this_page > max_page) {
					this_page = max_page;
					$('#this_page_view').html(this_page);
				}
				//localStorage['view_' + $('#content_no').val()] = this_page;
				$('#this_page_view').html(this_page);

				$('#novel_drawing_page_c').animate({
					scrollLeft: (page_width() * (this_page - 1))
				}, animation_100, function() { move_key = 0;
					page_cal();

				});
				page_cal();

			}

		}
	}



	function getTouches(evt) {
	  return evt.touches ||             // browser API
		 evt.originalEvent.touches; // jQuery
	}

	function handleTouchStart(evt) {
	    const firstTouch = getTouches(evt)[0];
	    xDown = firstTouch.clientX;
	    yDown = firstTouch.clientY;
	};

	function handleTouchMove(evt) {

	    if ( ! xDown || ! yDown) {
		return;
	    }

	    var xUp = evt.touches[0].clientX;
	    var yUp = evt.touches[0].clientY;

	    var xDiff = xDown - xUp;
	    var yDiff = yDown - yUp;

	    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/

		if(option_btn_comment == 0) {
			if(localStorage['viewer_paging'] == 1) {
				if ( xDiff > 0 ) {
					page_next();
					/* left swipe */
				} else {
					page_back();
					/* right swipe */
				}
			}
		}

	    } else {
		if ( yDiff > 0 ) {
		    /* up swipe */
		} else {
		    /* down swipe */
		}
	    }
	    /* reset values */
	    xDown = null;
	    yDown = null;
	};

	function novel_drawing(novel_d) {
		//$('#novel_drawing').html('');
		//$('#novel_drawing_page').html('');

		$('#novel_drawing').show();

		if(localStorage['viewer_paging'] == "1") {
			
			$('#novel_drawing_left').show();
			$('#novel_drawing_right').show();

			//console.log("w" + $(document).width());

			if($(document).width() > 1200) {
				$('.mobile_hidden3').show();
			} else {
				$('.mobile_hidden3').hide();
			}


			$('#page_cnt').show();

			$('#novel_drawing_page').css("-webkit-column-gap", '20px');
			$('#novel_drawing_page').css("-moz-column-gap", '20px');
			$('#novel_drawing_page').css("column-gap", '20px');
			$('#novel_drawing_page').css("background-color", '#ffffff01');
			//$('#novel_drawing_page').css("display", 'inline-block');

			var t_width = $(document).width() - 40;
			if($(document).width() > 880) {
				$('#novel_drawing_page').css("-webkit-column-width", '880px');
				$('#novel_drawing_page').css("-moz-column-width", '880px');
				$('#novel_drawing_page').css("column-width", '880px');
			} else {
				$('#novel_drawing_page').css("-webkit-column-width", Number(t_width - 40) + 'px');
				$('#novel_drawing_page').css("-moz-column-width", Number(t_width - 40) + 'px');
				$('#novel_drawing_page').css("column-width", Number(t_width - 40) + 'px');
			}

			var text_temp = "";

			text_temp = text_temp + "<br><br><br><br>";

			var line = 0;
			var is_indent = $("#is_indent").val() ;
			$.each(novel_d, function(key, value) {
				// 자동 들여쓰기
				if(Number(is_indent) == 1) {
					text_temp = text_temp + "" + value.text + " </span><br>";
				} else {
					text_temp = text_temp + "&nbsp;&nbsp;&nbsp;" + value.text + " </span><br>";
				}
				//
				// if(value.text.startsWith("&nbsp;") || value.text.startsWith("　")) {
				// 	text_temp = text_temp + "" + value.text + " </span><br>";
				// } else {
				// 	text_temp = text_temp + "&nbsp;&nbsp;&nbsp;" + value.text + " </span><br>";
				// }
				//$('#novel_drawing').append(value.text + " </span><br>");
			});
			text_temp = text_temp + $('#footer_plus').val();
			//$('#novel_drawing').append($('#footer_plus').val());

			//max_page = Math.ceil($("#novel_text").outerHeight() / ($("#novel_box").height()));
			//$('#novel_drawing_page').css("width", (t_width * page));
			$('#novel_drawing_page').css("margin-top", '10px');
			//$('#novel_drawing_page').css("height", $('#novel_box').height() - 60);
			var t_height = Number($('#novel_box').height()) - 60;
			$('#novel_drawing_page').css("-webkit-height", Number(t_height) + 'px');
			$('#novel_drawing_page').css("-moz-height", Number(t_height) + 'px');
			$('#novel_drawing_page').css("height", Number(t_height) + 'px');


			//max_page = $('#novel_drawing_page').css("column-count");

			$('#novel_drawing').hide();
			$('#novel_drawing_page').html(text_temp);
            if(text_temp.indexOf("cover-wrapper") != -1){
                $('#novel_drawing_page').prepend($(".cover-wrapper"));
            }
            else{
                $('#novel_drawing_page').prepend("<br><br><br><br>");
            }
			text_temp = "";

			// 썸네일 붙이기
			// if(this_thumb_flag==1 && this_thumb!='') {
			// 	$('#novel_drawing_page').prepend( '<div style="height: 100%; text-align:center;position: relative;"><img style="position: absolute;top: 34%;left: 50%;transform: translate(-50%, -50%);width: 50%;" src="'+this_thumb+'"></div>');
			// }


			if(data_load == 1) {
				$('#load_bar').hide();
				$('#writer_comments_box').show();
				$('#next_epi_btn_bottom').show();
			}

			setTimeout("page_cal()", 500);
			// setTimeout("page_goto(this_page)", 1000);
            setTimeout("getPageMark()", 600);

			if(localStorage.getItem(`bookmark_${g_content_no}`)) {
				setTimeout('check_start_position();', 700);
			}

		} else {

			$('#novel_drawing_left').hide();
			$('#novel_drawing_right').hide();

			var text_temp = "";
			text_temp = text_temp + "<br><br><br><br>";


			//$('#novel_drawing').append("<br><br><br><br>");
			var line = 0;
			var is_indent = $("#is_indent").val() ;
			$.each(novel_d, function(key, value) {
				// text_temp = text_temp + "<font id='line_" + (++line) + "' class='line'>" + value.text + " </font><br>";

				// 자동 들여쓰기
				if(Number(is_indent) == 1) {
					text_temp = text_temp + "<font id='line_" + (++line) + "' class='line'>" + value.text + " </font><br>";
				} else {
					text_temp = text_temp + "<font id='line_" + (++line) + "' class='line'>&nbsp;&nbsp;&nbsp;" + value.text + " </font><br>";
				}

				// if(value.text.startsWith("&nbsp;") || value.text.startsWith("　")) {
				// 	text_temp = text_temp + "<font id='line_" + (++line) + "' class='line'>" + value.text + " </font><br>";
				// } else {
				// 	text_temp = text_temp + "<font id='line_" + (++line) + "' class='line'>&nbsp;&nbsp;&nbsp;" + value.text + " </font><br>";
				// }

				//$('#novel_drawing').append("<span id='line_" + (++line) + "' class='line'>" + value.text + " </span><br>");
			});
			text_temp = text_temp + $('#footer_plus').val();
			//$('#novel_drawing').append($('#footer_plus').val());

			/*
			$('.line').each(function( index ) {
				if(localStorage['view_' + $('#content_no').val()] > index) {
					$( this ).css('opacity', '0.9');
				}
			});
			*/

			if(localStorage['viewer_nextepi'] == 'on') {
				text_temp = text_temp + "<br><br><br><br><br><br><br><br><br><br><br><br>";
			}


			//
			//

			$('#novel_drawing').html(text_temp);
			text_temp = "";
			if(data_load == 1) {
				$('#load_bar').hide();
				$('#writer_comments_box').show();
				$('#next_epi_btn_bottom').show();
			}

			$('#page_cnt').hide();

			// 썸네일 붙이기
			// if(this_thumb_flag==1 && this_thumb!='') {
			// 	$('#novel_drawing').prepend( '<div style="height: 100%; text-align:center;position: relative;margin-top: 100px;"><img style="width: 50%;" src="'+this_thumb+'"></div>');
			// }


			max_page = Math.floor($("#novel_text").outerHeight() / $("#novel_box").height()) + 1;
			$('#page_navigation').attr({ min: 1, max: max_page, step:1 });
			try	{ $('#page_navigation').rangeslider('update', true);} catch (e) {  }

			// setTimeout("page_goto(this_page)", 1000);
            setTimeout("getPageMark()", 600);
			if(localStorage.getItem(`bookmark_${g_content_no}`)) {
				setTimeout('check_start_position();', 700);
			}

            //var timer = null;
            //var height_half = ($("#novel_box").prop("scrollHeight")/2)-300;
            //$("#viewer-scroll-banner").css("top",height_half+"px");

            //if(window.innerWidth > 1499) { //뷰어 페이지 방식 스크롤 배너
            //     $("#viewer-side-banner").hide();
            //     if($("#viewer-scroll-banner").css("display") == "none"){
            //         $("#viewer-scroll-banner").show();
            //     }
            // }
            // $(window).resize(function(e){
            //     e.stopPropagation();
            //     clearTimeout(timer);
            //     timer = setTimeout(() => {
            //         if(window.innerWidth > 1499) {
            //             if($("#viewer-scroll-banner").css("display") == "none"){
            //                 $("#viewer-side-banner").hide();
            //                 $("#viewer-scroll-banner").show();
            //             }
            //         }else{
            //             $("#viewer-scroll-banner").hide();
            //         }
            //     }, 300);
            // })

            $('#novel_box').on('scroll', function() {
                var el = $(this);

                if((el.scrollTop() + el.innerHeight()) >= el[0].scrollHeight - 100) {
                    if($(".curation-wrapper").hasClass("none-curation")){
                        return false;
                    }else{
                        $(".curation-wrapper").fadeIn(300);
                    }
                }else{
                    $(".curation-wrapper").fadeOut(100);
                }
            });
		}
		//console.log("novel_drawing_end");
	}

	function page_width() {
		var val = ((($('#novel_drawing_page').find(':last').position().left + (-($('#novel_drawing_page').position().left)) + 20
			+ $('#novel_drawing_page_c').width())
			/ max_page));
		return val;
	}
    //var is_last_page = false ;
	function page_cal() {

		if(this_page == 0) { this_page = 1; }
		if(this_page != 1) { back_epi_check = 0; }
		max_page = Math.ceil((parseInt($('#novel_drawing_page_c').scrollLeft()) + $('#novel_drawing_page').find(':last').position().left) / ((parseInt($('#novel_drawing_page_c').width()) + 20)));
		if(this_page != max_page) { next_epi_check = 0; }

		$('#page_cnt').html(this_page + "/" + max_page);
		$('#page_navigation').attr('max', max_page);

		var arr_page_data = localStorage.getItem("bookmark_"+$('#content_no').val());
		if(arr_page_data==this_page){
			if($.cookie('DARKMODE') == 1) {
				$('#bookmark_div').css('color', 'rgb(117, 242, 70)');
			} else {
				$('#bookmark_div').css('color', 'rgb(160, 73, 180)');
			}
		}
		else {
			if($.cookie('DARKMODE') == 1) {
				$('#bookmark_div').css('color', '#ffffff7a');
			} else {
				$('#bookmark_div').css('color', '#0000007a');
			}
		}

		try	{ $('#page_navigation').rangeslider('update', true);} catch (e) {  }

        //var timer = null;

        //if($("#viewer-scroll-banner").css("display") != "none"){ //뷰어 페이지 방식 사이드 배너
        //     $("#viewer-scroll-banner").hide();
        // }
		// if(this_page != max_page){
        // //if(Math.floor(max_page/2) == this_page) {
        //     if(window.innerWidth > 1499) {
        //         $("#viewer-side-banner").show();
        //     }
        //     $(window).resize(function(e){
        //         e.stopPropagation();
        //         clearTimeout(timer);
        //         timer = setTimeout(() => {
        //             if(Math.floor(max_page/2) == this_page && window.innerWidth > 1499) {
        //                 if($("#viewer-side-banner").css("display") == "none"){
        //                     $("#viewer-side-banner").show();
        //                 }
        //             }else{
        //                 $("#viewer-side-banner").hide();
        //             }
        //         }, 300);
        //     })
        // }else{
        //     $("#viewer-side-banner").hide();
        // }
        //is_last_page =  this_page == max_page;
        if(this_page != max_page){
            $(".curation-wrapper").hide();
        }else{
            if($(".curation-wrapper").hasClass("none-curation")){
                return false;
            }else{
                $(".curation-wrapper").show();
            }
        }
	}

    function open_curation(not_novel_no, is_contest, novel_is_contest){//큐레이션
		let cmd_text = "viewer_curation";
		if(is_contest == novel_is_contest){
			// 공모전 종료 처리관련
			//cmd_text = "contest_curation";
		}

		console.log(cmd_text+' / '+novel_is_contest);

        $.ajax({
            data: {
            	cmd:cmd_text,
				not_novel_no : not_novel_no,
				novel_is_contest : novel_is_contest
			},
            type: "GET",
            url: "/proc/novel_curation",
            success: function(data) {
                if(data.status != 200) {
                    $(".curation-wrapper").addClass("none-curation");
                    return ;
                }
                let lists = data.list;

                if(lists.length == 0){
                    $(".curation-wrapper").addClass("none-curation");
                    return;
                }
                if(lists.length <= 3) {
                    $(".curation-btn").hide();
                }
                lists.forEach((item, index) => {
                    let age = "";
                    let position = "";

                    if(item.novel_age != "0") {
                        if(item.novel_age == "22") item.novel_age = "19";
                        age = `<span class="novel_`+item.novel_age+`">`+item.novel_age+`</span>`
                    }
                    if(index < 3){ position = "front-item"; }
                    if(index >= 3){ position = "back-item"; }

                    $("#curation-box").append(
                        `
                        <a href="`+item.link_url+`" data-index="`+index+`" class="`+position+`">
                        <div class="curation">
                            `+age+`
                            <img src="`+item.cover_url+`">
                            <h4>`+item.novel_name+`</h4>
                            <p>`+item.writer_nick+`</p>
                        </div>
                        </a>
                        `
                    )
                });
                $("#curation-title").text(data.conf.title);
                if($.cookie('DARKMODE') == 1) {
                    curation_dark();
                }
            }
        });
    }

    function curation_prev(){
        if($(".front-item").is(":visible") == true){
            return false;
        }
        $(".front-item").show();
        $(".back-item").hide();
    }

    function curation_next(){
        if($(".back-item").is(":visible") == true){
            return false;
        }
        $(".front-item").hide();
        $(".back-item").show();
    }

    function curation_dark(){
        $(".curation-wrapper").css('filter', 'invert(1)');
        $(".curation img").css('filter', 'invert(1)');
        $(".novel_19").css('filter', 'invert(1)');
        $(".novel_15").css('filter', 'invert(1)');
    }

	function episode_sort(option) {
		if(option == 'up') {
			//$.cookie('EPISODE_SORT', 'UP', { expires: 365, path: '/', domain: '.<?=DOMAIN?>', secure: false });
			localStorage['novel_sort_' + $('#novel_no').val()] = "UP";
			localStorage['novel_page_' + $('#novel_no').val()] = 0;
			$('.sort_up').attr('src', '/img/new/list/new_on.png');
			$('.sort_down').attr('src', '/img/new/list/old.png');
			episode_list_viewer(0);
		} else {
			//$.cookie('EPISODE_SORT', 'DOWN', { expires: 365, path: '/', domain: '.<?=DOMAIN?>', secure: false });
			localStorage['novel_sort_' + $('#novel_no').val()] = "DOWN";
			localStorage['novel_page_' + $('#novel_no').val()] = 0;
			$('.sort_up').attr('src', '/img/new/list/new.png');
			$('.sort_down').attr('src', '/img/new/list/old_on.png');
			episode_list_viewer(0);
		}
	}

	function comment_fileupload(file) {
		data = new FormData();
		data.append("file", file);
		data.append("csrf",  $('#csrf').val());
		$.ajax({
			data: data,
			type: "POST",
			url: "/proc/upload_image",
			cache: false,
			contentType: false,
			processData: false,
			success: function(data) {
				var check = data.split("|");
				if(check[0] == 'OK') {
					$('#comment_img').val(check[1]);
					$('#imagePreviewA').attr("src", check[1]);
					$('#imagePreviewframe').show();
				} else if(check[0] == 'MSG') {
					alert(check[1]);
				} else {
					alert("에러가 발생하였습니다.");
				}
			}
		});
	}

	function comment_fileupload2(file) {
		data = new FormData();
		data.append("file", file);
		data.append("csrf",  $('#csrf').val());
		$.ajax({
			data: data,
			type: "POST",
			url: "/proc/upload_image",
			cache: false,
			contentType: false,
			processData: false,
			success: function(data) {
				var check = data.split("|");
				if(check[0] == 'OK') {
					$('#re_comment_img').val(check[1]);
					$('#imagePreviewA2').attr("src", check[1]);
					$('#imagePreviewframe2').show();
				} else if(check[0] == 'MSG') {
					alert(check[1]);
				} else {
					alert("에러가 발생하였습니다.");
				}
			}
		});
	}


		function edit_comment_proc(idx) {

			if(edit_comment == 0) {
				edit_comment = 1;
				$.ajax({
					data: { comment_idx : idx, comment_msg : $('#comment_edit_' + idx).val(), csrf : $('#csrf').val() },
					type: "POST",
					url: "/proc/comment_edit_proc",
					cache: false,
					success: function(data) {
						var check = data.split("|");
						if(check[0] == 'OK') {
							alert("댓글이 수정되었습니다");
							comment_load();
						} else if(check[0] == 'MSG') {
							alert(check[1]);
						} else {
							alert("에러가 발생하였습니다.");
						}
						edit_comment = 0;
					}
				});
			}

		}


		function comment_delete_proc(idx) {

			if(comment_delete == 0) {
				if(confirm('정말 댓글을 삭제하시겠습니까?')) {
					comment_delete = 1;
					$.ajax({
						data: { comment_idx : idx, csrf : $('#csrf').val() },
						type: "POST",
						url: "/proc/comment_del_proc",
						cache: false,
						success: function(data) {
							var check = data.split("|");
							if(check[0] == 'OK') {
								alert("댓글이 삭제되었습니다");
								comment_load();
							} else if(check[0] == 'MSG') {
								alert(check[1]);
							} else {
								alert("에러가 발생하였습니다.");
							}
							comment_delete = 0;
						}
					});
				}
			}

		}
		function comment_write_proc() {

			if(comment_write == 0) {
				comment_write = 1;
				$.ajax({
					data: { mem_nick : $('#mem_nick').val(),comment_img : $('#comment_img').val(), comment_msg : $('#comment_msg').val(), content_no : $('#content_no').val(), csrf : $('#csrf').val()  },
					type: "POST",
					url: "/proc/comment_write_proc",
					cache: false,
					success: function(data) {
						var check = data.split("|");
						if(check[0] == 'OK') {
							alert("댓글이 등록되었습니다");
							comment_load();
							$('#mem_nick').val('');
							$('#comment_img').val('');
							$('#comment_msg').val('');
							$('#imagePreviewA').attr("src", "");
							$('#imagePreviewframe').hide();
							$('#comment_info').show();
						} else if(check[0] == 'AUTH') {
							if(confirm(check[1])) {
								location = '/page/comment_auth';
							}
						} else if(check[0] == 'MSG') {
							alert(check[1]);
						} else {
							alert("에러가 발생하였습니다.");
						}
						comment_write = 0;
					}
				});
			}

		}

		function re_comment_write_proc() {

			if(comment_write == 0) {
				comment_write = 1;
				$.ajax({
					data: { mem_nick : $('#re_mem_nick').val(), comment_img : $('#re_comment_img').val(), comment_msg : $('#re_comment_msg').val(), content_no : $('#re_content_no').val(), comment_re_no : $('#re_comment_re_no').val(), csrf : $('#csrf').val()  },
					type: "POST",
					url: "/proc/comment_write_proc",
					cache: false,
					success: function(data) {
						var check = data.split("|");
						if(check[0] == 'OK') {
							alert("댓글이 등록되었습니다");
							comment_load();
							$('#re_mem_nick').val('');
							$('#re_comment_img').val('');
							$('#re_comment_msg').val('');
							$('#re_comment_re_no').val('');
							$('#re_imagePreview').css("background-image", "");
							$('#re_comment_info').show();
						} else if(check[0] == 'MSG') {
							alert(check[1]);
						} else {
							alert("에러가 발생하였습니다.");
						}
						comment_write = 0;
					}
				});
			}

		}

		function comment_load() {
            //$('#comment_sort_box').load("/json/viewer_comment/");
            //$('#comment_load').load("/json/viewer_comment_production/" + $('#content_no').val() + "/" + localStorage['comment_sort'] + "/" + $('#comment_page').val(), function() {
			$('#comment_load').load("/json/viewer_comment/" + $('#content_no').val() + "/" + localStorage['comment_sort'] + "/" + $('#comment_page').val(), function() {
				// 3일 무료 이벤트
                free_emoticon_event();
				if($.cookie('DARKMODE') == 1) {
					$('#comment_box').css("filter", "invert(1)");
					$('#comment_box img').css("filter", "invert(1)");
                    $('#comment_box .nav-menu img').css("filter", "invert(0)");
                    $('#favorite_add').css("filter", "invert(1)");
                    $('#favorite_add img').css("filter", "invert(0)");
					$('#comment_box .c_inv').css("filter", "");
				} else {
					$('#comment_box').css("filter", "");
					$('#comment_box img').css("filter", "");
				}

				$('#comment_box').animate({ scrollTop: 0 }, animation_500);
			});
		}

        function free_emoticon_event(){
            // if($.cookie('READ_EMOJI_TUTORIAL') == 1) {
            //     return false;
            // }else{
            //     $.cookie('READ_EMOJI_TUTORIAL', '1', { expires: 1, path: '/', domain: '.novelpia.com', secure: false });
            //     $('#emoji_tutorial').show();
            // }
            $('#emoji_tutorial').show();
        }

	var back_epi_check = 0;
	var next_epi_check = 0;

	document.onkeydown = function(e) {
		if(option_btn_comment == 0 && option_btn_list == 0) {
			if(localStorage['viewer_paging'] == 1) {
				switch(e.key) {
				case "ArrowLeft": // left
				if(this_page == 1 && $('#back_epi_auto_url').val() != '') {
					if(back_epi_check == 0) {
						$('#back_info_layer').fadeIn(600).delay(1000).fadeOut(600);
						back_epi_check = 1;
					} else if(back_epi_check == 1) {
						pageload($('#back_epi_auto_url').val(), 1);
					}
				}
				page_back();
				break;

				case "ArrowRight": // right
				if(this_page == max_page && $('#next_epi_auto_url').val() != '') {
					if(next_epi_check == 0) {
						$('#next_info_layer').fadeIn(600).delay(1000).fadeOut(600);
						next_epi_check = 1;
					} else if(next_epi_check == 1) {
						pageload($('#next_epi_auto_url').val(), 1);
					}
				}
				page_next();
				break;

				default: return; // exit this handler for other keys
				}
				e.preventDefault(); // prevent the default action (scroll / move caret)
			} else {
				switch(e.key) {

				case "ArrowUp": // up
				$('#novel_box').animate({ scrollTop: $('#novel_box').scrollTop() - 200 }, animation_100);
                updateMark();
				break;
				case "ArrowDown": // down
				$('#novel_box').animate({ scrollTop: $('#novel_box').scrollTop() + 200 }, animation_100);
                updateMark();
				break;

				default: return; // exit this handler for other keys
				}
				e.preventDefault(); // prevent the default action (scroll / move caret)

			}
		}
	};



	// 테마 버튼
	function font_0_btn() {
		localStorage['viewer_font'] = '0';
		viewer_display();
	}
	function font_1_btn() {
		localStorage['viewer_font'] = '1';
		viewer_display();
	}
	function font_2_btn() {
		localStorage['viewer_font'] = '2';
		viewer_display();
	}
	function font_3_btn() {
		localStorage['viewer_font'] = '3';
		viewer_display();
	}
	function font_4_btn() {
		localStorage['viewer_font'] = '4';
		viewer_display();
	}

	function size_12_btn() {
		localStorage['viewer_fontsize'] = 12;
		viewer_display();
	}

	function size_14_btn() {
		localStorage['viewer_fontsize'] = 14;
		viewer_display();
	}

	function size_18_btn() {
		localStorage['viewer_fontsize'] = 18;
		viewer_display();
	}

	function size_22_btn() {
		localStorage['viewer_fontsize'] = 22;
		viewer_display();
	}

	function size_26_btn() {
		localStorage['viewer_fontsize'] = 26;
		viewer_display();
	}

	function size_down_btn() {
		if(parseInt(localStorage['viewer_fontsize']) > 11) {
			localStorage['viewer_fontsize'] = parseInt(localStorage['viewer_fontsize']) - 1;
			$('#size_display').css("font-size", localStorage['viewer_fontsize'] + "px");
		} else {
			alert("더 작은 글자 크기를 제공하지 않습니다.");
		}
		viewer_display();
	}
	function size_up_btn() {
		if(parseInt(localStorage['viewer_fontsize']) < 32) {
			localStorage['viewer_fontsize'] = parseInt(localStorage['viewer_fontsize']) + 1;
			$('#size_display').css("font-size", localStorage['viewer_fontsize'] + "px");
		} else {
			alert("더 큰 글자 크기를 제공하지 않습니다.");
		}
		viewer_display();
	}

	///////////////////////////////////////////////////

	function weight_200_btn() {
		localStorage['viewer_weight'] = 200;
		viewer_display();
	}

	function weight_300_btn() {
		localStorage['viewer_weight'] = 300;
		viewer_display();
	}

	function weight_400_btn() {
		localStorage['viewer_weight'] = 400;
		viewer_display();
	}

	function weight_500_btn() {
		localStorage['viewer_weight'] = 500;
		viewer_display();
	}

	function weight_700_btn() {
		localStorage['viewer_weight'] = 700;
		viewer_display();
	}

	///////////////////////////////////////////////////

	function line_130_btn() {
		localStorage['viewer_fontline'] = 130;
		viewer_display();
	}

	function line_160_btn() {
		localStorage['viewer_fontline'] = 160;
		viewer_display();
	}

	function line_200_btn() {
		localStorage['viewer_fontline'] = 200;
		viewer_display();
	}

	function line_250_btn() {
		localStorage['viewer_fontline'] = 250;
		viewer_display();
	}

	function line_down_btn() {
		if(parseInt(localStorage['viewer_fontline']) > 100) {
			localStorage['viewer_fontline'] = parseInt(localStorage['viewer_fontline']) - 10;
			$('#line_display').text(localStorage['viewer_fontline'] + "%");
		} else {
			alert("더 좁은 줄간격을 제공하지 않습니다.");
		}
		viewer_display();
	}
	function line_up_btn() {
		if(parseInt(localStorage['viewer_fontline']) < 400) {
			localStorage['viewer_fontline'] = parseInt(localStorage['viewer_fontline']) + 10;
			$('#line_display').text(localStorage['viewer_fontline'] + "%");
		} else {
			alert("더 넓은 줄간격을 제공하지 않습니다.");
		}
		viewer_display();
	}


	function line_300_btn() {
		localStorage['viewer_fontline'] = 300;
		viewer_display();
	}

	function img_off_btn() {
		//localStorage['viewer_visual'] = 1;
		$.cookie('BLOCK_ILLUSTRATION', 'ON', { expires: 365, path: '/', domain: '.novelpia.com', secure: false });
		viewer_display();
	}
	function img_on_btn() {
		//localStorage['viewer_visual'] = '';
		$.cookie('BLOCK_ILLUSTRATION', '', { expires: 365, path: '/', domain: '.novelpia.com', secure: false });
		viewer_display();
	}



	function bg_1_btn() {
		localStorage['viewer_bg'] = 1;
		viewer_display();
	}
	function bg_2_btn() {
		localStorage['viewer_bg'] = 2;
		viewer_display();
	}
	function bg_3_btn() {
		localStorage['viewer_bg'] = 3;
		viewer_display();
	}
	function bg_4_btn() {
		localStorage['viewer_bg'] = 4;
		viewer_display();
	}
	function bg_5_btn() {
		//localStorage['viewer_bg'] = 5;
		viewer_display();
	}


	function color_1_btn() {
		localStorage['viewer_color'] = 1;
		viewer_display();
	}
	function color_2_btn() {
		localStorage['viewer_color'] = 2;
		viewer_display();
	}
	function color_3_btn() {
		localStorage['viewer_color'] = 3;
		viewer_display();
	}
	function color_4_btn() {
		localStorage['viewer_color'] = 4;
		viewer_display();
	}
	function color_5_btn() {
		//localStorage['viewer_color'] = 5;
		viewer_display();
	}

	function dark_on_btn() {
		$('.loads').css("filter", "invert(1)");
		$.cookie('DARKMODE', '1', { expires: 365, path: '/', domain: '.novelpia.com', secure: false });
		viewer_display();
	}
	function dark_off_btn() {
		$('.loads').css("filter", "");
		$.cookie('DARKMODE', '', { expires: 365, path: '/', domain: '.novelpia.com', secure: false });
		viewer_display();
	}



	function viewer_1_btn() {
		localStorage['viewer_paging'] = '';
		//localStorage['view_' + $('#content_no').val()] = 1;
		up_down_btn_view('on');
		// viewer_display();
        location.reload(true);
	}
	function viewer_2_btn() {
		localStorage['viewer_paging'] = 1;
		//localStorage['view_' + $('#content_no').val()] = 1;
					//console.log("viewer_2_btn - off");
		up_down_btn_view('off');
		// viewer_display();
        location.reload(true);
	}

	// function spelling_1_btn() {
	// 	$.cookie('SPELLING_C', '', { expires: 365, path: '/', domain: '.novelpia.com', secure: false });
	// 	location.reload(true);
	// }
	// function spelling_2_btn() {
	// 	$.cookie('SPELLING_C', '1', { expires: 365, path: '/', domain: '.novelpia.com', secure: false });
	// 	location.reload(true);
	// }
	// function spelling_3_btn() {
	// 	$.cookie('SPELLING_C', '2', { expires: 365, path: '/', domain: '.novelpia.com', secure: false });
	// 	location.reload(true);
	// }
	// function spelling_4_btn() {
	// 	$.cookie('SPELLING_C', '3', { expires: 365, path: '/', domain: '.novelpia.com', secure: false });
	// 	location.reload(true);
	// }



	function topbar_on_btn() {
		localStorage['viewer_topbar'] = 'show';
		$.cookie('APP_TOPBAR', 'show', { expires: 365, path: '/', domain: '.novelpia.com', secure: false });
		try { window.novelpia.topbar_on(); } catch (e) {  }
		location.reload(true);
	}
	function topbar_off_btn() {
		localStorage['viewer_topbar'] = '';
		$.cookie('APP_TOPBAR', '', { expires: 365, path: '/', domain: '.novelpia.com', secure: false });
		try { window.novelpia.topbar_off(); } catch (e) {  }
		location.reload(true);
	}
	function volume_on_btn() {
		localStorage['viewer_volume'] = 'on';
		try { window.novelpia.volume_on(); } catch (e) {  }
		viewer_display();
	}
	function volume_off_btn() {
		localStorage['viewer_volume'] = '';
		try { window.novelpia.volume_off(); } catch (e) {  }
		viewer_display();
	}

	function animation_on_btn() {
		localStorage['viewer_animation'] = 'on';
		animation_100 = 100;
		animation_500 = 500;
		animation_1000 = 1000;
		viewer_display();
	}
	function animation_off_btn() {
		localStorage['viewer_animation'] = '';
		animation_100 = 0;
		animation_500 = 0;
		animation_1000 = 0;
		viewer_display();
	}
	function auto_nextepi_on_btn() {
		localStorage['viewer_nextepi'] = 'on';
		viewer_display();
	}
	function auto_nextepi_off_btn() {
		localStorage['viewer_nextepi'] = '';
		viewer_display();
	}
	function navigation_on_btn() {
		$.cookie('NAVIGATION', '1', { expires: 365, path: '/', domain: '.novelpia.com', secure: false });
		location.reload(true);
	}
	function navigation_off_btn() {
		$.cookie('NAVIGATION', '0', { expires: 365, path: '/', domain: '.novelpia.com', secure: false });
		location.reload(true);
	}
    // 플로팅 버튼 사용 유무
    function float_use_on_btn() {
		localStorage['viewer_float'] = 'on';
		viewer_display();
	}
    function float_use_off_btn() {
		localStorage['viewer_float'] = '';
		viewer_display();
	}
    // 플로팅 위치 버튼
    function float_position_left_btn() {
		localStorage['viewer_float_position'] = 'left';
		viewer_display();
	}
    function float_position_right_btn() {
		localStorage['viewer_float_position'] = 'right';
		viewer_display();
	}


function btn_comment_on() {
	if($.cookie('DARKMODE') == 1) {
		$('#comment_box').css("filter", "invert(1)");
		$('#comment_box img').css("filter", "invert(1)");
	} else {
		$('#comment_box').css("filter", "");
		$('#comment_box img').css("filter", "");
	}
    if($('#footer_bar').is(":visible") == false){
        $('#footer_bar').show();
        $('#header_bar').show();
        $('#float-menu').show();
    }
	//comment_load();
	get_comment_box();
	option_btn_list = 0;
	option_btn_comment = 1;
	option_btn_theme = 0;
	$('#btn_comment').attr('src', '/img/new/viewer/btn_comment_on.png');
	$('#btn_list').attr('src', '/img/new/viewer/btn_list.png');
	$('#btn_theme').attr('src', '/img/new/viewer/btn_theme.png');
	up_down_btn_view('on');
	$('#btn_comment_text').css("color", "#a049b4");
	$('#navigation_group').hide();
	$('#comment_box').hide();
	$('#novel_box').hide();
	$('#theme_box').hide();
	$('#comment_box').show();

}

function btn_comment_off() {
	option_btn_comment = 0;
	if(localStorage['viewer_paging'] == 1) {
		up_down_btn_view('off');
        if(viewer_screen_height !== $(document).height()) {
            setTimeout(function() {
                viewer_display();
            }, 500);
        } else {
            viewer_display();
        }
	} else {
		up_down_btn_view('on');
	}
	$('#btn_comment').attr('src', '/img/new/viewer/btn_comment.png');
	$('#btn_comment_text').css("color", "#000");
	$('#navigation_group').show();
	$('#comment_box').hide();
	$('#novel_box').show();
	$('#theme_box').hide();
	$('#list_box').hide();
	$('#comment_box').hide();
}




	function page_up() {
		if(option_btn_comment == 1) {
			$('#comment_box').animate({ scrollTop: 0 }, animation_500);
		} else {
			$('#novel_box').animate({ scrollTop: 0 }, animation_1000);
		}
		up_down_btn_view('on');
	}

	function page_down() {
		if(option_btn_comment == 1) {
			//$('#comment_box').animate({ scrollTop: $('#comment_load').outerHeight() - 20 }, animation_500);
            $('#comment_box').animate({scrollTop: $('#comment_box').prop("scrollHeight")}, animation_500);
		} else {
			$('#novel_box').animate({ scrollTop: $('#novel_text').outerHeight() - $("#novel_box").height() - 20 }, animation_1000);
		}
		up_down_btn_view('on');
	}

	function up_down_btn_view(option) {

		//console.log("up_down_btn_view('" + option + "');");

		if(option == 'on') {

			if(option_btn_comment == 1) {
                var currentPercentage = ($("#comment_box").scrollTop() / ($('#comment_box').prop("scrollHeight") - $("#comment_box").height())) * 100;
			} else {
				var currentPercentage = ($("#novel_box").scrollTop() / ($("#novel_text").outerHeight() - $("#novel_box").height())) * 100;
			}

			if(currentPercentage < 10) {
				$('#scroll_up_btn').hide();
				$('#scroll_down_btn').show();
				//console.log("#scroll_down_btn - show;");
			} else if(currentPercentage > 90) {
				$('#scroll_up_btn').show();
				$('#scroll_down_btn').hide();
				//console.log("#scroll_down_btn - hide;");
			} else {
				$('#scroll_up_btn').show();
				$('#scroll_down_btn').show();
				//console.log("#scroll_down_btn - show2;");
			}
			//console.log("currentPercentage('" + currentPercentage + "');");

		} else {
				//console.log("#scroll_down_btn - hide2;");
			$('#scroll_up_btn').hide();
			$('#scroll_down_btn').hide();
		}

	}


	$("#comment_box").scroll(function(){
		up_down_btn_view('on');
	});

	function navi_view() {
		// console.log('test_option_btn_comment:' + option_btn_comment);
		if(option_btn_comment != 1) {
			//console.log('test_toggle_navi:' + toggle_navi);
			if(toggle_navi == 1) {
				$('#footer_bar').show();
				$('#header_bar').show();
                $('#float-menu').show();
				if(localStorage['viewer_paging'] != 1) {
					up_down_btn_view('on');
				}
				toggle_navi = 0;
			} else {
                $('#footer_bar').hide();
				$('#header_bar').hide();
				$('#theme_box').hide();
                $('#float-menu').hide();
				//console.log("navi_view - off");
				up_down_btn_view('off');
				option_btn_theme = 0;
				$('#btn_theme').attr('src', '/img/new/viewer/btn_theme.png');
				toggle_navi = 1;
			}
		}
	}
	function option_proc(option, value) {
		if(option == 'comment_vote' || option == 'comment_unvote') {
			$('#comment_vote_' + value).load("/proc/board_option", { "option": option, "value": value, "mode": 'novel' });
		} else if(option == 'comment_bad_vote' || option == 'comment_bad_unvote') {
			$('#comment_bad_vote_' + value).load("/proc/board_option", { "option": option, "value": value, "mode": 'novel' });
		} else if(option == 'vote' || option == 'unvote') {
			$('#vote_btn').load("/proc/board_option", { "option": option, "value": value, "mode": 'novel' });
		} else if(option == 'comment_report') {
			if($.cookie("secret_mode") == '1'){
				alert("시크릿 모드에서는 신고 할 수 없습니다.");
				return ;
			}
			if(confirm("댓글을 신고하시겠습니까?\n신고 접수 시 사용자 페이지에서는 해당 유저의 댓글이 모두 비활성화 처리되며 내용은 운영팀에 접수됩니다.")){
				$('#comment_report_' + value).load("/proc/board_option", { "option": option, "value": value, "mode": 'novel' });
				//console.log('#comment_' + value);
				$('#comment_' + value).remove();
			}
		}
	}

	function episode_vote() {

		if($.cookie("secret_mode") == '1'){
			alert("시크릿 모드에서는 추천을 할 수 없습니다.");
			return;
		}

		$.ajax({
			data: { "option": 'vote_novel', "value": $('#content_no').val(), csrf : $('#csrf').val() },
			type: "POST",
			url: "/proc/board_option",
			cache: false,
			success: function(data) {
				var check = data.split("|");
				if(check[0] == 'MSG') {
					alert(check[1]);
				} else if(check[0] == 'on') {
                    like_animation();
					$('#btn_episode_vote').attr("src", "/img/new/viewer/btn_vote_on2.png");
					$('#btn_episode_text').html(check[1]);
					$('#btn_episode_text').css("color", "#a049b4");

				} else if(check[0]  == 'off') {
					$('#btn_episode_vote').attr("src", "/img/new/viewer/btn_vote.png");
					$('#btn_episode_text').html(check[1]);
					$('#btn_episode_text').css("color", "#000");

				} else if(check[0] == 'login') {
					if(confirm("추천을 위해서는 로그인이 필요합니다.\n로그인 하시겠습니까?")) {
						location = "/page/login";
					}

				} else {
					alert("에러가 발생하였습니다.");
				}

			}
		});

	}

	function novel_like_btn() {

		if($.cookie("secret_mode") == '1'){
			alert("시크릿 모드에서는 선호작 변경을 할 수 없습니다.");
			return ;
		}

		$.ajax({
			data: { "novel_no": $('#novel_no').val(), csrf : $('#csrf').val() },
			type: "POST",
			url: "/proc/novel_like",
			cache: false,
			success: function(data) {
				var check = data.split("|");
				if(check[0] == 'on') {
					$('#btn_like').attr("src", "/img/new/viewer/btn_like_on2.png");
					$('#btn_like_text').html(check[1]);
					$('#btn_like_text').css("color", "#a049b4");

					toastr.options.escapeHtml = true;
					toastr.options.closeButton = true;
					toastr.options.newestOnTop = false;
					toastr.options.progressBar = true;
					toastr.info('선호작', '선호작이 등록되었습니다.', {timeOut: 5000});

					if(check[3] == 1){
						toastr.options.escapeHtml = true;
						toastr.options.closeButton = true;
						toastr.options.newestOnTop = false;
						toastr.options.progressBar = true;
						toastr.success('빙고', '미션에 성공하셨습니다.', {timeOut: 5000});
					}

				} else if(check[0]  == 'off') {
					$('#btn_like').attr("src", "/img/new/viewer/btn_like.png");
					$('#btn_like_text').html(check[1]);
					$('#btn_like_text').css("color", "#000");

					toastr.options.escapeHtml = true;
					toastr.options.closeButton = true;
					toastr.options.newestOnTop = false;
					toastr.options.progressBar = true;
					toastr.warning('선호작', '선호작이 해제되었습니다.', {timeOut: 5000});


				} else if(check[0] == 'login') {
					if(confirm("선호작 등록을 위해서는 로그인이 필요합니다.\n로그인 하시겠습니까?")) {
						location = "/page/login";
					}
				} else {
					alert("에러가 발생하였습니다.");
				}
			}
		});

	}




	function viewer_display() {

		$('#novel_text').show();

		if(localStorage['viewer_font'] == 2) {
			$('#novel_box').css("font-family", "'Noto Serif KR', 'Noto Serif JP'");
		} else if(localStorage['viewer_font'] == 3) {
			$('#novel_box').css("font-family", "'Yeon Sung', 'Noto Serif KR', 'Noto Serif JP'");
		} else if(localStorage['viewer_font'] == 4) {
			$('#novel_box').css("font-family", "'Jua', 'Noto Serif KR', 'Noto Serif JP'");
		} else if(localStorage['viewer_font'] == 0) {
			$('#novel_box').css("font-family", 'auto');
		} else {
			$('#novel_box').css("font-family", "'Noto Sans KR', 'Noto Sans JP'");
		}
		/*
		$('#novel_box').animate({ "font-size": localStorage['viewer_fontsize'] + 'px'}, 200);
		$('#novel_box').animate({ "line-height": localStorage['viewer_fontline'] + '%'}, 200);
		*/

		$('#novel_box').css("font-size", localStorage['viewer_fontsize'] + 'px');
		$('#novel_box').css("line-height", localStorage['viewer_fontline'] + '%');
		$('#novel_box').css("font-weight", localStorage['viewer_weight']);

		if( typeof novel_data !== "undefined" && novel_data ) {
			//console.log("novel_drawing");
			novel_drawing(novel_data);
		}


		if($.cookie('DARKMODE') == 1) {


			if($.cookie('BLOCK_ILLUSTRATION') == 'ON') {
				$('#novel_text img').css({"display": "none"}, 'slow');
				$('.img_btn').css("border", "1px solid #333");
				$('#img_off_btn').css("border", "1px solid #999");
			} else {
				$('#novel_text img').css({"display": ""}, 'slow');
				$('.img_btn').css("border", "1px solid #333");
				$('#img_on_btn').css("border", "1px solid #999");
			}

			$('.dark_btn').css("border", "1px solid #333");
			$('#dark_on_btn').css("border", "1px solid #999");

			$('.viewer_btn').css("border", "1px solid #333");
			if(localStorage['viewer_paging'] == 1) {
				$('#viewer_2_btn').css("border", "1px solid #999");
			} else {
				$('#viewer_1_btn').css("border", "1px solid #999");
			}


			$('.topbar_btn').css("border", "1px solid #333");
			if(localStorage['viewer_topbar'] == 'show') {
				$('#topbar_on_btn').css("border", "1px solid #999");
			} else {
				$('#topbar_off_btn').css("border", "1px solid #999");
			}

			$('.volume_btn').css("border", "1px solid #333");
			if(localStorage['viewer_volume'] == 'on') {
				$('#volume_on_btn').css("border", "1px solid #999");
			} else {
				$('#volume_off_btn').css("border", "1px solid #999");
			}


			// $('.spelling_btn').css("border", "1px solid #333");
			// if($.cookie('SPELLING_C') == '1') {
			// 	$('#spelling_2_btn').css("border", "1px solid #999");
			// } else if($.cookie('SPELLING_C') == '2') {
			// 	$('#spelling_3_btn').css("border", "1px solid #999");
			// } else if($.cookie('SPELLING_C') == '3') {
			// 	$('#spelling_4_btn').css("border", "1px solid #999");
			// } else {
			// 	$('#spelling_1_btn').css("border", "1px solid #999");
			// }

			$('.animation_btn').css("border", "1px solid #333");
			if(localStorage['viewer_animation'] == 'on') {
				$('#animation_on_btn').css("border", "1px solid #999");
			} else {
				$('#animation_off_btn').css("border", "1px solid #999");
			}

			$('.auto_nextepi_btn').css("border", "1px solid #333");
			if(localStorage['viewer_nextepi'] == 'on') {
				$('#auto_nextepi_on_btn').css("border", "1px solid #999");
			} else {
				$('#auto_nextepi_off_btn').css("border", "1px solid #999");
			}

			$('.navigation_btn').css("border", "1px solid #333");
			if($.cookie('NAVIGATION') == 1) {
				$('#navigation_on_btn').css("border", "1px solid #999");
			} else {
				$('#navigation_off_btn').css("border", "1px solid #999");
			}

            $('.float_use_btn').css("border", "1px solid #333");
			if(localStorage['viewer_float'] == 'on') {
				$('#float_use_on_btn').css("border", "1px solid #999");
                $('#float-menu-wrapper').css('display','block');
			} else {
				$('#float_use_off_btn').css("border", "1px solid #999");
                $('#float-menu-wrapper').css('display','none');
			}

            $('.float_position_btn').css("border", "1px solid #333");
			if(localStorage['viewer_float_position'] == 'left') {
				$('#float_position_left_btn').css("border", "1px solid #999");
			} else {
				$('#float_position_right_btn').css("border", "1px solid #999");
			}


			$('.font_btn').css("border", "1px solid #333");
			if(localStorage['viewer_font'] == 2) {
				$('#font_2_btn').css("border", "1px solid #999");
			} else if(localStorage['viewer_font'] == 3) {
				$('#font_3_btn').css("border", "1px solid #999");
			} else if(localStorage['viewer_font'] == 4) {
				$('#font_4_btn').css("border", "1px solid #999");
			} else if(localStorage['viewer_font'] == 0) {
				$('#font_0_btn').css("border", "1px solid #999");
			} else {
				$('#font_1_btn').css("border", "1px solid #999");
			}




			$('#footer_bar').css({"background-color": '#222'}, 'slow');
			$('#footer_bar').css({"color": '#aaa'}, 'slow');
			$('#header_bar').css({"background-color": '#222'}, 'slow');
			$('#header_bar').css({"color": '#aaa'}, 'slow');

            $('.float-menu-box div').css({"background-color": '#FFF'}, 'slow');
            $('.float-menu-box div img').css({"filter": 'invert(1)'});

			$('#theme_box').css({"background-color": '#222'}, 'slow');
			$('#theme_box').css({"color": '#aaa'}, 'slow');

			$('.color_btn').css("border", "1px solid #333");
			$('#color_1_btn').css({"background-color": '#fff'}, 'slow');
			$('#color_2_btn').css({"background-color": '#b1b1b1'}, 'slow');
			$('#color_3_btn').css({"background-color": '#e0da6a'}, 'slow');
			$('#color_4_btn').css({"background-color": '#80d46e'}, 'slow');
			if(localStorage['viewer_color'] != 1 && localStorage['viewer_color'] != 2 && localStorage['viewer_color'] != 3 && localStorage['viewer_color'] != 4) {
				$('#color_5_btn').css({"background-color": localStorage['viewer_color']}, 'slow');
			}


			if(localStorage['viewer_color'] == 1 || localStorage['viewer_color'] == '' || typeof localStorage['viewer_color'] === 'undefined') {
				$('#novel_text').css("color", '#fff');
				$('#color_1_btn').css("border", "1px solid #999");
			} else if(localStorage['viewer_color'] == 2) {
				$('#novel_text').css("color", '#b1b1b1');
				$('#color_2_btn').css("border", "1px solid #999");
			} else if(localStorage['viewer_color'] == 3) {
				$('#novel_text').css("color", '#e0da6a');
				$('#color_3_btn').css("border", "1px solid #999");
			} else if(localStorage['viewer_color'] == 4) {
				$('#novel_text').css("color", '#80d46e');
				$('#color_4_btn').css("border", "1px solid #999");
			} else {
				$('#novel_text').css("color", localStorage['viewer_color']);
				$('#color_5_btn').css("border", "1px solid #999");
			}


			$('.bg_btn').css("border", "1px solid #333");
			$('#bg_1_btn').css({"background-color": '#000'}, 'slow');
			$('#bg_2_btn').css({"background-color": '#4e4e4e'}, 'slow');
			$('#bg_3_btn').css({"background-color": '#565314'}, 'slow');
			$('#bg_4_btn').css({"background-color": '#225816'}, 'slow');

			if(localStorage['viewer_bg'] != 1 && localStorage['viewer_bg'] != 2 && localStorage['viewer_bg'] != 3 && localStorage['viewer_bg'] != 4) {
				$('#bg_5_btn').css({"background-color": localStorage['viewer_bg']}, 'slow');
                // $('#header_bar').css({"background-color": localStorage['viewer_bg']}, 'slow');
                // $('#footer_bar').css({"background-color": localStorage['viewer_bg']}, 'slow');
			}

			$('.footer_btn').css("filter", "invert(1)");
			//$('.loads').css("filter", "invert(1)");

			$('#btn_comment_text').css("filter", "invert(1)");
			$('#btn_episode_text').css("filter", "invert(1)");
			$('#btn_like_text').css("filter", "invert(1)");

			$('#list_box').css("filter", "invert(1)");
			$('#comment_box').css("filter", "invert(1)");

			$('#list_box img').css("filter", "invert(1)");
			$('#comment_box img').css("filter", "invert(1)");

			$('#page_cnt').css('color', "#ccc");

			if(localStorage['viewer_bg'] == 1 || localStorage['viewer_bg'] == '' || typeof localStorage['viewer_bg'] === 'undefined') {
				$('#viewer_no_drag').css({"background-color": '#000'}, 'slow');
				$('#novel_box').css({"background-color": '#000'}, 'slow');
				$('#bg_1_btn').css("border", "1px solid #999");
                // $('#header_bar').css({"background-color": '#000'}, 'slow');
                // $('#footer_bar').css({"background-color": '#000'}, 'slow');
			} else if(localStorage['viewer_bg'] == 2) {
				$('#viewer_no_drag').css({"background-color": '#4e4e4e'}, 'slow');
				$('#novel_box').css({"background-color": '#4e4e4e'}, 'slow');
				$('#bg_2_btn').css("border", "1px solid #999");
                // $('#header_bar').css({"background-color": '#4e4e4e'}, 'slow');
                // $('#footer_bar').css({"background-color": '#4e4e4e'}, 'slow');
			} else if(localStorage['viewer_bg'] == 3) {
				$('#viewer_no_drag').css({"background-color": '#565314'}, 'slow');
				$('#novel_box').css({"background-color": '#565314'}, 'slow');
				$('#bg_3_btn').css("border", "1px solid #999");
                // $('#header_bar').css({"background-color": '#565314'}, 'slow');
                // $('#footer_bar').css({"background-color": '#565314'}, 'slow');
			} else if(localStorage['viewer_bg'] == 4) {
				$('#viewer_no_drag').css({"background-color": '#225816'}, 'slow');
				$('#novel_box').css({"background-color": '#225816'}, 'slow');
				$('#bg_4_btn').css("border", "1px solid #999");
                // $('#header_bar').css({"background-color": '#225816'}, 'slow');
                // $('#footer_bar').css({"background-color": '#225816'}, 'slow');
			} else {
				$('#viewer_no_drag').css({"background-color": localStorage['viewer_bg']}, 'slow');
				$('#novel_box').css({"background-color": localStorage['viewer_bg']}, 'slow');
				$('#bg_5_btn').css("border", "1px solid #999");
                // $('#header_bar').css({"background-color": localStorage['viewer_bg']}, 'slow');
                // $('#footer_bar').css({"background-color": localStorage['viewer_bg']}, 'slow');
			}

			$('#i-am-progress-indicator').css({"background-color": '#444'}, 'slow');

			$('.up_down').css({"color": '#fff'}, 'slow');
			$('.up_down').css({"background-color": '#333'}, 'slow');
			$('.up_down').css("border", "1px solid #333");

			$('.navigation_div').css("background-color", "#0000007a");
			$('.navigation_div').css("color", "#aaa");


			$('.loads').css("filter", "invert(1)");
			$('.episode_title').css("filter", "invert(0)");
			$('.sort_up').css("filter", "invert(0)");
			$('.sort_down').css("filter", "invert(0)");

			$('.line_btn').css("border", "1px solid #333");
			$('#line_' + localStorage['viewer_fontline'] + '_btn').css("border", "1px solid #999");

			$('.weight_btn').css("border", "1px solid #333");
			$('#weight_' + localStorage['viewer_weight'] + '_btn').css("border", "1px solid #999");

			$('.size_btn').css("border", "1px solid #333");
			$('#size_' + localStorage['viewer_fontsize'] + '_btn').css("border", "1px solid #999");

			$('.novelticon-modal .detail-modal-wrapper').css('filter', 'invert(1)');
			$('.novelticon-modal .detail-modal-wrapper img').css('filter', 'invert(1)');
			$('.novelticon-modal .detail-modal-top > div:last-child img').css('filter', 'invert(0)');
			$('.novelticon-modal .detail-modal-top > div:first-child img').attr('src', '/img/new/logo_dark.png');

			// 100원
			$(".one-event-plus-btn").css('filter', 'invert(1)');
            $(".method3").css('filter', 'invert(1)');
            $(".method3 div").css('filter', 'invert(1)');
            $(".method3").css('border', '1px solid #1c1c1c');
            $("#plus_modal .basic-modal-close").css('filter', 'invert(1)');

            $("#novel_box").addClass("dark_scroll");

            //큐레이션
            $(".curation-wrapper").css('filter', 'invert(1)');
            $(".curation img").css('filter', 'invert(1)');
            $(".novel_19").css('filter', 'invert(1)');
            $(".novel_15").css('filter', 'invert(1)');
		} else {

			if($.cookie('BLOCK_ILLUSTRATION') == 'ON') {
				$('#novel_text img').css({"display": "none"}, 'slow');
				$('.img_btn').css("border", "1px solid #ddd");
				$('#img_off_btn').css("border", "1px solid #999");
			} else {
				$('#novel_text img').css({"display": ""}, 'slow');
				$('.img_btn').css("border", "1px solid #ddd");
				$('#img_on_btn').css("border", "1px solid #999");
			}


			$('.dark_btn').css("border", "1px solid #ddd");
			$('#dark_off_btn').css("border", "1px solid #999");

			$('.viewer_btn').css("border", "1px solid #ddd");
			if(localStorage['viewer_paging'] == 1) {
				$('#viewer_2_btn').css("border", "1px solid #999");
			} else {
				$('#viewer_1_btn').css("border", "1px solid #999");
			}

			$('.topbar_btn').css("border", "1px solid #ddd");
			if(localStorage['viewer_topbar'] == 'show') {
				$('#topbar_on_btn').css("border", "1px solid #999");
			} else {
				$('#topbar_off_btn').css("border", "1px solid #999");
			}

			$('.volume_btn').css("border", "1px solid #ddd");
			if(localStorage['viewer_volume'] == 'on') {
				$('#volume_on_btn').css("border", "1px solid #999");
			} else {
				$('#volume_off_btn').css("border", "1px solid #999");
			}

			// $('.spelling_btn').css("border", "1px solid #ddd");
			// if($.cookie('SPELLING_C') == '1') {
			// 	$('#spelling_2_btn').css("border", "1px solid #999");
			// } else if($.cookie('SPELLING_C') == '2') {
			// 	$('#spelling_3_btn').css("border", "1px solid #999");
			// } else if($.cookie('SPELLING_C') == '3') {
			// 	$('#spelling_4_btn').css("border", "1px solid #999");
			// } else {
			// 	$('#spelling_1_btn').css("border", "1px solid #999");
			// }


			$('.animation_btn').css("border", "1px solid #ddd");
			if(localStorage['viewer_animation'] == 'on') {
				$('#animation_on_btn').css("border", "1px solid #999");
			} else {
				$('#animation_off_btn').css("border", "1px solid #999");
			}

			$('.auto_nextepi_btn').css("border", "1px solid #ddd");
			if(localStorage['viewer_nextepi'] == 'on') {
				$('#auto_nextepi_on_btn').css("border", "1px solid #999");
			} else {
				$('#auto_nextepi_off_btn').css("border", "1px solid #999");
			}


			$('.navigation_btn').css("border", "1px solid #ddd");
			if($.cookie('NAVIGATION') == 1) {
				$('#navigation_on_btn').css("border", "1px solid #999");
			} else {
				$('#navigation_off_btn').css("border", "1px solid #999");
			}

            $('.float_use_btn').css("border", "1px solid #ddd");
			if(localStorage['viewer_float'] == 'on') {
				$('#float_use_on_btn').css("border", "1px solid #999");
                $('#float-menu-wrapper').css('display','block');
			} else {
				$('#float_use_off_btn').css("border", "1px solid #999");
                $('#float-menu-wrapper').css('display','none');
			}

            $('.float_position_btn').css("border", "1px solid #ddd");
			if(localStorage['viewer_float_position'] == 'left') {
				$('#float_position_left_btn').css("border", "1px solid #999");
                $('.float-menu-box').css({'left':'0px','margin-right': '0','margin-left': '4.5%','right': 'inherit'});
			} else {
				$('#float_position_right_btn').css("border", "1px solid #999");
                $('.float-menu-box').css({'right':'0px','margin-right': '4.5%','margin-left': '0','left': 'inherit'});
			}


			$('.font_btn').css("border", "1px solid #ddd");
			if(localStorage['viewer_font'] == '2') {
				$('#font_2_btn').css("border", "1px solid #999");
			} else if(localStorage['viewer_font'] == '3') {
				$('#font_3_btn').css("border", "1px solid #999");
			} else if(localStorage['viewer_font'] == '4') {
				$('#font_4_btn').css("border", "1px solid #999");
			} else if(localStorage['viewer_font'] == '0') {
				$('#font_0_btn').css("border", "1px solid #999");
			} else {
				$('#font_1_btn').css("border", "1px solid #999");
			}



			$('#footer_bar').css({"background-color": '#fff'}, 'slow');
			$('#footer_bar').css({"color": '#000'}, 'slow');
			$('#header_bar').css({"background-color": '#fff'}, 'slow');
			$('#header_bar').css({"color": '#000'}, 'slow');

            $('.float-menu-box div').css({"background-color": '#000000CC'}, 'slow');
            $('.float-menu-box div img').css({"filter": 'invert(0)'});

			$('#theme_box').css({"background-color": '#fff'}, 'slow');
			$('#theme_box').css({"color": '#000'}, 'slow');

			$('.color_btn').css("border", "1px solid #ddd");
			$('#color_1_btn').css({"background-color": '#000'}, 'slow');
			$('#color_2_btn').css({"background-color": '#545454'}, 'slow');
			$('#color_3_btn').css({"background-color": '#797417'}, 'slow');
			$('#color_4_btn').css({"background-color": '#246b15'}, 'slow');
			if(localStorage['viewer_color'] != 1 && localStorage['viewer_color'] != 2 && localStorage['viewer_color'] != 3 && localStorage['viewer_color'] != 4) {
				$('#color_5_btn').css({"background-color": localStorage['viewer_color']}, 'slow');
			}

			if(localStorage['viewer_color'] == 1 || localStorage['viewer_color'] == '' || typeof localStorage['viewer_color'] === 'undefined') {
				$('#novel_text').css("color", '#000');
				$('#color_1_btn').css("border", "1px solid #333");
			} else if(localStorage['viewer_color'] == 2) {
				$('#novel_text').css("color", '#545454');
				$('#color_2_btn').css("border", "1px solid #333");
			} else if(localStorage['viewer_color'] == 3) {
				$('#novel_text').css("color", '#797417');
				$('#color_3_btn').css("border", "1px solid #333");
			} else if(localStorage['viewer_color'] == 4) {
				$('#novel_text').css("color", '#246b15');
				$('#color_4_btn').css("border", "1px solid #333");
			} else {
				$('#novel_text').css("color", localStorage['viewer_color']);
				$('#color_5_btn').css("border", "1px solid #333");
			}

			$('.bg_btn').css("border", "1px solid #ddd");
			$('#bg_1_btn').css({"background-color": '#fff'}, 'slow');
			$('#bg_2_btn').css({"background-color": '#e3e3e3'}, 'slow');
			$('#bg_3_btn').css({"background-color": '#fffddb'}, 'slow');
			$('#bg_4_btn').css({"background-color": '#c4ecbb'}, 'slow');
			if(localStorage['viewer_bg'] != 1 && localStorage['viewer_bg'] != 2 && localStorage['viewer_bg'] != 3 && localStorage['viewer_bg'] != 4) {
				$('#bg_5_btn').css({"background-color": localStorage['viewer_bg']}, 'slow');
                // $('#header_bar').css({"background-color": localStorage['viewer_bg']}, 'slow');
                // $('#footer_bar').css({"background-color": localStorage['viewer_bg']}, 'slow');
			}

			$('.footer_btn').css("filter", "");
			//$('.loads').css("filter", "");

			$('.loads').css("filter", "");
			$('.episode_title').css("filter", "");
			$('.sort_up').css("filter", "");
			$('.sort_down').css("filter", "");


			$('#btn_comment_text').css("filter", "");
			$('#btn_episode_text').css("filter", "");
			$('#btn_like_text').css("filter", "");

			$('#list_box').css("filter", "");
			$('#comment_box').css("filter", "");

			$('#list_box img').css("filter", "");
			$('#comment_box img').css("filter", "");

			$('#page_cnt').css('color', "#333");

			if(localStorage['viewer_bg'] == 1 || localStorage['viewer_bg'] == '' || typeof localStorage['viewer_bg'] === 'undefined') {
				$('#viewer_no_drag').css({"background-color": '#fff'}, 'slow');
				$('#novel_box').css({"background-color": '#fff'}, 'slow');
				$('#bg_1_btn').css("border", "1px solid #999");
                // $('#header_bar').css({"background-color": '#fff'}, 'slow');
                // $('#footer_bar').css({"background-color": '#fff'}, 'slow');
				//console.log("viewer_bg : 1");
			} else if(localStorage['viewer_bg'] == 2) {
				$('#viewer_no_drag').css({"background-color": '#e3e3e3'}, 'slow');
				$('#novel_box').css({"background-color": '#e3e3e3'}, 'slow');
				$('#bg_2_btn').css("border", "1px solid #999");
                // $('#header_bar').css({"background-color": '#e3e3e3'}, 'slow');
                // $('#footer_bar').css({"background-color": '#e3e3e3'}, 'slow');
				//console.log("viewer_bg : 2");
			} else if(localStorage['viewer_bg'] == 3) {
				$('#viewer_no_drag').css({"background-color": '#fffddb'}, 'slow');
				$('#novel_box').css({"background-color": '#fffddb'}, 'slow');
				$('#bg_3_btn').css("border", "1px solid #999");
                // $('#header_bar').css({"background-color": '#fffddb'}, 'slow');
                // $('#footer_bar').css({"background-color": '#fffddb'}, 'slow');
				//console.log("viewer_bg : 3");
			} else if(localStorage['viewer_bg'] == 4) {
				$('#viewer_no_drag').css({"background-color": '#c4ecbb'}, 'slow');
				$('#novel_box').css({"background-color": '#c4ecbb'}, 'slow');
				$('#bg_4_btn').css("border", "1px solid #999");
                // $('#header_bar').css({"background-color": '#c4ecbb'}, 'slow');
                // $('#footer_bar').css({"background-color": '#c4ecbb'}, 'slow');
				//console.log("viewer_bg : 4");
			} else {
				$('#viewer_no_drag').css({"background-color": localStorage['viewer_bg']}, 'slow');
				$('#novel_box').css({"background-color": localStorage['viewer_bg']}, 'slow');
				$('#bg_5_btn').css("border", "1px solid #999");
                // $('#header_bar').css({"background-color": localStorage['viewer_bg']}, 'slow');
                // $('#footer_bar').css({"background-color": localStorage['viewer_bg']}, 'slow');
				//console.log("viewer_bg : [" + localStorage['viewer_bg'] + "]");
			}

			$('#i-am-progress-indicator').css({"background-color": '#ccc'}, 'slow');

			$('.up_down').css({"color": '#000'}, 'slow');
			$('.up_down').css({"background-color": '#fff'}, 'slow');
			$('.up_down').css("border", "1px solid #ddd");

			$('.navigation_div').css("background-color", "#ffffff7a");
			$('.navigation_div').css("color", "#777");

			$('.line_btn').css("border", "1px solid #ddd");
			$('#line_' + localStorage['viewer_fontline'] + '_btn').css("border", "1px solid #999");

			$('.weight_btn').css("border", "1px solid #ddd");
			$('#weight_' + localStorage['viewer_weight'] + '_btn').css("border", "1px solid #999");

			$('.size_btn').css("border", "1px solid #ddd");
			$('#size_' + localStorage['viewer_fontsize'] + '_btn').css("border", "1px solid #999");

			$('.novelticon-modal .detail-modal-wrapper').css('filter', '');
			$('.novelticon-modal .detail-modal-wrapper img').css('filter', '');
			$('.novelticon-modal .detail-modal-top > div:last-child img').css('filter', '');
			$('.novelticon-modal .detail-modal-top > div:first-child img').attr('src', '/img/new/logo2.png');

            $("#novel_box").removeClass("dark_scroll");

            //큐레이션
            $(".curation-wrapper").css('filter', '');
            $(".curation img").css('filter', '');
            $(".novel_19").css('filter', '');
            $(".novel_15").css('filter', '');
		}

		if(localStorage['bookmark_' + $('#content_no').val()] > 0) {
			if($.cookie('DARKMODE') == 1) {
				$('#bookmark_div').css('color', 'rgb(117, 242, 70)');
			} else {
				$('#bookmark_div').css('color', 'rgb(160, 73, 180)');
			}
		} else {
			if($.cookie('DARKMODE') == 1) {
				$('#bookmark_div').css('color', '#ffffff7a');
			} else {
				$('#bookmark_div').css('color', '#0000007a');
			}
		}


		$('#msapplication-TileColor').attr('content', $('#novel_box').css("background-color"));
		$('#msapplication-navbutton-color').attr('content', $('#novel_box').css("background-color"));
		$('#apple-mobile-web-app-status-bar-style').attr('content', $('#novel_box').css("background-color"));
		$('#theme-color').attr('content', $('#novel_box').css("background-color"));



		//setTimeout("$('#novel_text').show()", 1);



	}

    // 커버이미지 숨기기
    function cover_hide(){
        if($.cookie('COVER_OPEN') == 1){
            $.cookie('COVER_OPEN', '', { expires: 365, path: '/', domain: '.novelpia.com', secure: false });
            $(".cover-img").addClass("cover-no");
            $(".cover-text").html('커버보기 <i class="icon ion-ios-arrow-down"></i>');
        }else{
            $.cookie('COVER_OPEN', '1', { expires: 365, path: '/', domain: '.novelpia.com', secure: false });
            // $(".cover-img").show();
            $(".cover-img").removeClass("cover-no");
            $(".cover-text").html('커버접기 <i class="icon ion-ios-arrow-up"></i>');
        }
    }

    function show_illustration(id){
        $('#imgs_'+id).addClass("show-illustration");
        $('.illust-text-'+id).text("");
    }

	// 플러스 100원 이벤트 15~16 넘어갈때
	function show_mathod(){
		$(".event_100won_buy").show();
	}

	// 플러스 100원 이벤트 15~16 넘어갈때 결제
	function pay_card(){ //카드
		if( !$(".one-event-buy-agree #c7[type=checkbox]").is(':checked') == true) {
			alert("결제 안내사항에 동의해주시기 바랍니다.");
			return ;
		}
        window.open('/proc/payjoa_card_auto/card-batch/7', '_blank', 'width=500,height=600');
	}

	function pay_naver(){ //네이버
		if( !$(".one-event-buy-agree #c7[type=checkbox]").is(':checked') == true) {
			alert("결제 안내사항에 동의해주시기 바랍니다.");
			return ;
		}
		window.open('https://pay.novelpia.com/pay/naver/step1?goods=7&site=novelpia', '_blank', 'width=500,height=600');
	}

	function pay_kakao(){ //카카오
		if( !$(".one-event-buy-agree #c7[type=checkbox]").is(':checked') == true) {
			alert("결제 안내사항에 동의해주시기 바랍니다.");
			return ;
		}
        window.open('/proc/kakaopay2_call/7', '_blank', 'width=500,height=600');
	}

    function other_pay_open(method) {
        if(method == 'other'){
            $(".other-hide").hide();
            $(".other-event").show();
        }else{
            $(".other-hide").show();
            $(".other-event").hide();
        }
    }

const get_viewer_like = () => {
    const novel_no = $('#novel_no').val();

    $.ajax({
        data: {
            mode: 'get_viewer_like',
            novel_no: novel_no
        },
        type: "POST",
        url: "/proc/viewer",
        cache: false,
        success: function(data) {
            if(data.status === 200) {
                if(data.result === 'OK') {
                    $('#btn_like').attr('src', '/img/new/viewer/btn_like_on2.png');
					$('#btn_like_text').html(data.cnt);
					$('#btn_like_text').css("color", "#a049b4");
                } else {
                    $('#btn_like').attr('src', '/img/new/viewer/btn_like.png');
					$('#btn_like_text').html(data.cnt);
					$('#btn_like_text').css("color", "#000");
                }
            }

        }
    });
}

const get_viewer_vote = () => {
    const content_no = $('#content_no').val();

    $.ajax({
        data: {
            mode: 'get_viewer_vote',
            content_no: content_no
        },
        type: "POST",
        url: "/proc/viewer",
        cache: false,
        success: function(data) {
            if(data.status === 200) {
                if(data.result === 'OK') {
                    $('#btn_episode_vote').attr('src', '/img/new/viewer/btn_vote_on2.png');
                    $('#btn_episode_text').html(data.cnt);
					$('#btn_episode_text').css("color", "#a049b4");
                } else {
                    $('#btn_episode_vote').attr('src', '/img/new/viewer/btn_vote.png');
                    $('#btn_episode_text').html(data.cnt);
                    $('#btn_episode_text').css("color", "#000");
                }
            }
        }
    });
}

//viewer toast_msg
const viewer_call_toast_msg = (toast_fn, type) => {
    let image_url = '//image.novelpia.com/img/new/viewer/viewer_toast2.png';
    if(type == 1) {
        image_url = '//image.novelpia.com/img/new/novel_gift/viewer_toast_gift.png';
    } else if(type == 2){
        image_url = '//image.novelpia.com/img/new/event/pass2023/pass_mission_complete.png';
    }
// 요소 만들기 부분
const new_element = document.createElement("div");
const css_text = `position: fixed;
                top: 10%;
                left: 50%;
                width: 90%;
                transform: translate(-50%, -50%);
                z-index: 9999;
                text-align: center;
                opacity: 0;
                transition: opacity 1s ease 0s;
                
                background-image: url(${image_url});
                height: 60px;
                background-repeat: no-repeat;
                background-position: center;
                background-size: contain;
                `;

    new_element.classList.add('toast_box');
    new_element.classList.add('s_inv');
    new_element.style.cssText = css_text;
    document.body.appendChild(new_element);

    // //애니메이션 실행 부분
    setTimeout(() => {
        document.querySelector(".toast_box").style.opacity='1'; //in
    }, 100);
    setTimeout(() => {
        document.querySelector(".toast_box").style.opacity='0'; //out
		document.querySelector(".toast_box").style.display='none'; //out
    }, 3000);


    if(typeof toast_fn === "function") {
        toast_fn();
    }
}

// viewer_call_toast_msg2('0','1'); 
// 0 : 빙고완료
// 1 : 출석+빙고완료
const status = 0;
const viewer_call_toast_msg2 = (status) => {

    // 요소 만들기 부분
    const new_element = document.createElement("div");
    const css_text = `position: fixed;
                    top: 10%;
                    left: 50%;
                    width: 90%;
                    transform: translate(-50%, -50%);
                    z-index: 9999;
                    text-align: center;
                    opacity: 0;
                    transition: opacity 1s ease 0s;
                    background-image: url(//image.novelpia.com/img/new/event/2th_contest/bingo/mission_toast.png);
                    height: 60px;
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: contain;
                    `;

    new_element.classList.add('toast_box2');
    new_element.classList.add('s_inv');
    new_element.style.cssText = css_text;
    document.body.appendChild(new_element);

    // //애니메이션 실행 부분
    if(status == 0){
        setTimeout(() => {
            document.querySelector(".toast_box2").style.opacity='1'; //in
        }, 100);
        setTimeout(() => {
            document.querySelector(".toast_box2").style.opacity='0'; //out
        }, 3000);
    }

    if(status == 1){
        setTimeout(() => {
            document.querySelector(".toast_box2").style.opacity='1'; //in
        }, 3500);
        setTimeout(() => {
            document.querySelector(".toast_box2").style.opacity='0'; //out
        }, 6000);
    }

}
