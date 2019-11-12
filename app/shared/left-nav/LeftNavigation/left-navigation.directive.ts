import { Directive, ElementRef } from '@angular/core';
var slideUp: any;

@Directive({
  selector: '[left-menu-nav]'
})
export class LeftNavigationDirective {
  value: number = 0;
  constructor(el: ElementRef) {

  }
  ngOnInit() {
    this.value++;
    $('.menu ul').hide();
    this.hideNavigation();
    $('.menu ul').children('.current').parent().show();
    $('.menu li a').click(
      function (event: any) {
        event.stopImmediatePropagation();
        var checkElement = $(this).next();
        if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
          var link = $('.menu ul:visible').parent().children('a');
          link && link.children('.left-menu-arrow-down').show();
          link && link.children('.left-menu-arrow-right').hide();
          $('.menu ul:visible').slideDown('normal');
          $(this).children('.left-menu-arrow-down').hide();
          $(this).children('.left-menu-arrow-right').show();
          checkElement.slideUp('normal');
          slideUp = true;
          return false;
        }
        if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {

          $('.menu ul:visible').parent().children('a').children('.left-menu-arrow-down').hide();
          $('.menu ul:visible').parent().children('a').children('.left-menu-arrow-right').show();
          $('.menu ul:visible').slideUp('normal');
          $(this).children('.left-menu-arrow-down').show();
          $(this).children('.left-menu-arrow-right').hide();
          checkElement.slideDown('normal');
          slideUp = false;
          return false;
        }
      }
    );
    $('.sidebar-nav li').click(function (event: any) {
      event.stopImmediatePropagation();
      var links = $("a[routerLinkActive]");
      if (links.length > 0) {

        links.each(function () {
          $(this).removeClass('link-active');
        });
      }
      $(this).children('a').addClass('link-active');
    });
    $('.sidebaricon').off('click');
    $('.sidebaricon').click(function (event: any) {
      $('.left-sidebar').toggleClass('sidebar-width');
      $('.sidebar-menu').toggleClass('sidebarmenu-width');
      $('.content-wrapper').toggleClass('content-width');
      $('.list-arrow').toggleClass('list-arrow-visibility');
      $('.menu-text').toggleClass('menu-text-visibility');
    });
    $(".menu>li>a.menu-list").click(() => {
      var checkElement = $('.menu li a').next();
      $('.menu ul:visible').slideDown('normal');
      $('.menu li a').children('.left-menu-arrow-down').hide();
      $('.menu li a').children('.left-menu-arrow-right').show();
      checkElement.slideUp('normal');
      slideUp = true;
      return false;
    });
    var self = this;
    $(".sidebar_menu .fa-times").click(function () {
      self.hideNavigation();
    });
    $(".toggle_menu").click(function () {
      self.enableNavigation();
    });
    $(".sidebar_menu .menu_list").click(function () {
      self.hideNavigation();
    });
    /*$(".sidebar_menu .menu_text").bind('click', function(){
      self.hideNavigation();
    });*/
  }
  enableNavigation() {
    $(".sidebar_menu").removeClass("hide_menu");
    $(".toggle_menu").removeClass("opacity_one");
  }
  hideNavigation() {
    $(".sidebar_menu").addClass("hide_menu");
    $(".toggle_menu").addClass("opacity_one");
  }
  ngAfterViewChecked() {
    var activeLink = $('.active-link');
    $('a:not(.active-link)').removeClass('link-active');

    if (activeLink.length > 0 && activeLink.hasClass('menu-list')) {
      activeLink.addClass('link-active');
    }
    if ($('.menu li ul .link-active').length > 0 && slideUp != true && this.value == 1) {
      $('.menu li ul .link-active').parent().parent().slideDown('normal');
      var group = $('.menu li ul .link-active').parent().parent().parent();
      group && group.children('a').eq(0).children('.left-menu-arrow-down').show();
      group && group.children('a').eq(0).children('.left-menu-arrow-right').hide();
      this.value++;
    }
  }
}