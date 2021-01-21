<script>
    document.documentElement.classList.toggle("dark");
    document.addEventListener("DOMContentLoaded", function () {
        var modeSwitch = document.querySelector(".mode-switch");

        modeSwitch.addEventListener("click", function () {
            modeSwitch.classList.toggle("active");
        });
    });
</script>

<style type="text/scss">
    * {
        box-sizing: border-box;
    }

    :root {
        --main-color: #fff;
        --secondary-color: rgba(255, 255, 255, 0.8);
        --link-color: rgba(255, 255, 255, 0.8);
        --link-color-hover: rgba(195, 207, 244, 0.1);
        --link-color-active-bg: rgba(195, 207, 244, 0.2);
        --button-bg: #2f3142;
        --star: #ffd92c;
    }

    button,
    a {
        cursor: pointer;
    }

    .app {
        &-icon {
            width: 26px;
            height: 2px;
            border-radius: 4px;
            background-color: var(--main-color);
            position: relative;

            &:before,
            &:after {
                content: "";
                position: absolute;
                width: 12px;
                height: 2px;
                border-radius: 4px;
                background-color: var(--main-color);
                left: 50%;
                transform: translatex(-50%);
            }

            &:before {
                top: -6px;
            }
            &:after {
                bottom: -6px;
            }
        }

        &-name {
            color: var(--main-color);
            margin: 0;
            font-size: 20px;
            line-height: 24px;
            font-weight: 700;
            margin: 0 32px;
        }
    }

    .add-btn {
        color: #fff;
        background-color: var(--button-bg);
        padding: 0;
        border: 0;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .notification-btn {
        color: var(--main-color);
        padding: 0;
        border: 0;
        background-color: transparent;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .profile-btn {
        padding: 0;
        border: 0;
        background-color: transparent;
        display: flex;
        align-items: center;
        padding-left: 12px;
        border-left: 2px solid #ddd;

        img {
            width: 32px;
            height: 32px;
            object-fit: cover;
            border-radius: 50%;
            margin-right: 4px;
        }

        span {
            color: var(--main-color);
            font-size: 16px;
            line-height: 24px;
            font-weight: 700;
        }
    }

    .page-content  {
        flex: 1;
        width: 100%;
    }

    .app-sidebar {
        padding: 40px 16px;
        display: flex;
        flex-direction: column;
        align-items: center;

        &-link {
            color: var(--main-color);
            color: var(--link-color);
            margin: 16px 0;
            transition: 0.2s;
            border-radius: 50%;
            flex-shrink: 0;
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;

            &:hover {
                background-color: var(--link-color-hover);
                color: var(--link-color-active);
            }

            &.active {
                background-color: var(--link-color-active-bg);
                color: var(--link-color-active);
            }
        }
    }

    .projects-section {
        flex: 2;
        padding: 32px 32px 0 32px;
        overflow: hidden;
        height: 100%;
        display: flex;
        flex-direction: column;

        &-line {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 32px;
        }

        &-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            color: var(--main-color);

            p {
                font-size: 24px;
                line-height: 32px;
                font-weight: 700;
                opacity: 0.9;
                margin: 0;
                color: var(--main-color);
            }

            .time {
                font-size: 20px;
            }
        }
    }

    .projects-status {
        display: flex;
    }

    .item-status {
        display: flex;
        flex-direction: column;
        margin-right: 16px;

        &:not(:last-child) .status-type:after {
            content: "";
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translatey(-50%);
            width: 6px;
            height: 6px;
            border-radius: 50%;
            border: 1px solid var(--secondary-color);
        }
    }

    .status-number {
        font-size: 24px;
        line-height: 32px;
        font-weight: 700;
        color: var(--main-color);
    }

    .status-type {
        position: relative;
        padding-right: 24px;
        color: var(--secondary-color);
    }

    .star-checkbox {
        input {
            opacity: 0;
            position: absolute;
            width: 0;
            height: 0;
        }

        label {
            width: 24px;
            height: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }

        .dark & {
            color: var(--secondary-color);

            input:checked + label {
                color: var(--star);
            }
        }

        input:checked + label svg {
            fill: var(--star);
            transition: 0.2s;
        }
    }

    .project-boxes {
        margin: 0 -8px;
        overflow-y: auto;

        &.jsGridView {
            display: flex;
            flex-wrap: wrap;

            .project-box-wrapper {
                width: 33.3%;
            }
        }

        &.jsListView {
            .project-box {
                display: flex;
                border-radius: 10px;
                position: relative;
                > * {
                    margin-right: 24px;
                }
            }

            .more-wrapper {
                position: absolute;
                right: 16px;
                top: 16px;
            }

            .project-box-content-header {
                order: 1;
                max-width: 120px;
            }

            .project-box-header {
                order: 2;
            }

            .project-box-footer {
                order: 3;
                padding-top: 0;
                flex-direction: column;
                justify-content: flex-start;
            }

            .project-box-footer:after {
                display: none;
            }

            .participants {
                margin-bottom: 8px;
            }

            .project-box-content-header p {
                text-align: left;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .project-box-header > span {
                position: absolute;
                bottom: 16px;
                left: 16px;
                font-size: 12px;
            }

            .box-progress-wrapper {
                order: 3;
                flex: 1;
            }
        }
    }

    .project-box {
        --main-color-card: #dbf6fd;
        border-radius: 30px;
        padding: 16px;
        background-color: var(--main-color-card);

        &-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
            color: var(--main-color);

            span {
                color: #4a4a4a;
                opacity: 0.7;
                font-size: 14px;
                line-height: 16px;
            }
        }

        &-content-header {
            text-align: center;
            margin-bottom: 16px;

            p {
                margin: 0;
            }
        }

        &-wrapper {
            padding: 8px;
            transition: 0.2s;
        }
    }

    .project-btn-more {
        padding: 0;
        height: 14px;
        width: 24px;
        height: 24px;
        position: relative;
        background-color: transparent;
        border: none;
        flex-shrink: 0;
    }

    .more-wrapper {
        position: relative;
    }

    .box-content-header {
        font-size: 16px;
        line-height: 24px;
        font-weight: 700;
        opacity: 0.7;
    }

    .box-content-subheader {
        font-size: 14px;
        line-height: 24px;
        opacity: 0.7;
    }

    .box-progress {
        display: block;
        height: 4px;
        border-radius: 6px;

        &-bar {
            width: 100%;
            height: 4px;
            border-radius: 6px;
            overflow: hidden;
            background-color: #fff;
            margin: 8px 0;
        }

        &-header {
            font-size: 14px;
            font-weight: 700;
            line-height: 16px;
            margin: 0;
        }

        &-wrapper {
        }

        &-percentage {
            text-align: right;
            margin: 0;
            font-size: 14px;
            font-weight: 700;
            line-height: 16px;
        }
    }

    .project-box-footer {
        display: flex;
        justify-content: space-between;
        padding-top: 16px;
        position: relative;

        &:after {
            content: "";
            position: absolute;
            background-color: rgba(255, 255, 255, 0.6);
            width: calc(100% + 32px);
            top: 0;
            left: -16px;
            height: 1px;
        }
    }

    .participants {
        display: flex;
        align-items: center;

        img {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            overflow: hidden;
            object-fit: cover;

            &:not(:first-child) {
                margin-left: -8px;
            }
        }
    }

    .add-participant {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: none;
        background-color: rgba(255, 255, 255, 0.6);
        margin-left: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
    }

    .days-left {
        background-color: rgba(255, 255, 255, 0.6);
        font-size: 12px;
        border-radius: 20px;
        flex-shrink: 0;
        padding: 6px 16px;
        font-weight: 700;
    }

    @media screen and (max-width: 980px) {
        .project-boxes.jsGridView .project-box-wrapper {
            width: 50%;
        }

        .status-number,
        .status-type {
            font-size: 14px;
        }

        .status-type:after {
            width: 4px;
            height: 4px;
        }

        .item-status {
            margin-right: 0;
        }
    }

    @media screen and (max-width: 720px) {
        .app-name,
        .profile-btn span {
            display: none;
        }

        .add-btn,
        .notification-btn,
        .mode-switch {
            width: 20px;
            height: 20px;

            svg {
                width: 16px;
                height: 16px;
            }
        }

        .app-header-right button {
            margin-left: 4px;
        }
    }

    @media screen and (max-width: 520px) {
        .projects-section {
            overflow: auto;
        }
        .project-boxes {
            overflow-y: visible;
        }

        .status-number,
        .status-type {
            font-size: 10px;
        }
        .project-boxes.jsGridView .project-box-wrapper {
            width: 100%;
        }

        .projects-section {
            padding: 24px 16px 0 16px;
        }

        .profile-btn img {
            width: 24px;
            height: 24px;
        }

        .projects-section-header p,
        .projects-section-header .time {
            font-size: 18px;
        }

        .status-type {
            padding-right: 4px;

            &:after {
                display: none;
            }
        }

        .box-content-header {
            font-size: 12px;
            line-height: 16px;
        }

        .box-content-subheader {
            font-size: 10px;
            line-height: 16px;
        }

        .project-boxes.jsListView .project-box-header > span {
            font-size: 10px;
        }

        .box-progress-header {
            font-size: 12px;
        }

        .box-progress-percentage {
            font-size: 10px;
        }

        .days-left {
            font-size: 8px;
            padding: 6px 6px;
            text-align: center;
        }

        .project-boxes.jsListView .project-box > * {
            margin-right: 10px;
        }

        .project-boxes.jsListView .more-wrapper {
            right: 2px;
            top: 10px;
        }
    }
</style>

<div class="projects-section">
    <div class="projects-section-header">
        <p>Projects</p>
        <p class="time">December, 12</p>
    </div>
    <div class="projects-section-line">
        <div class="projects-status">
            <div class="item-status">
                <span class="status-number">45</span>
                <span class="status-type">In Progress</span>
            </div>
            <div class="item-status">
                <span class="status-number">24</span>
                <span class="status-type">Upcoming</span>
            </div>
            <div class="item-status">
                <span class="status-number">62</span>
                <span class="status-type">Total Projects</span>
            </div>
        </div>
    </div>
    <div class="project-boxes jsListView">
        <div class="project-box-wrapper">
            <div class="project-box" style="background-color: #fee4cb;">
                <div class="project-box-header">
                    <span>December 10, 2020</span>
                    <div class="more-wrapper">
                        <button class="project-btn-more">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="feather feather-more-vertical">
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" /></svg>
                        </button>
                    </div>
                </div>
                <div class="project-box-content-header">
                    <p class="box-content-header">Web Designing</p>
                    <p class="box-content-subheader">Prototyping</p>
                </div>
                <div class="box-progress-wrapper">
                    <p class="box-progress-header">Progress</p>
                    <div class="box-progress-bar">
                        <span
                            class="box-progress"
                            style="width: 60%; background-color: #ff942e" />
                    </div>
                    <p class="box-progress-percentage">60%</p>
                </div>
                <div class="project-box-footer">
                    <div class="participants">
                        <img
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
                            alt="participant" />
                        <img
                            src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTB8fG1hbnxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60"
                            alt="participant" />
                        <button class="add-participant" style="color: #ff942e;">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="3"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="feather feather-plus">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </button>
                    </div>
                    <div class="days-left" style="color: #ff942e;">
                        2 Days Left
                    </div>
                </div>
            </div>
        </div>
        <div class="project-box-wrapper">
            <div class="project-box" style="background-color: #e9e7fd;">
                <div class="project-box-header">
                    <span>December 10, 2020</span>
                    <div class="more-wrapper">
                        <button class="project-btn-more">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="feather feather-more-vertical">
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" /></svg>
                        </button>
                    </div>
                </div>
                <div class="project-box-content-header">
                    <p class="box-content-header">Testing</p>
                    <p class="box-content-subheader">Prototyping</p>
                </div>
                <div class="box-progress-wrapper">
                    <p class="box-progress-header">Progress</p>
                    <div class="box-progress-bar">
                        <span
                            class="box-progress"
                            style="width: 50%; background-color: #4f3ff0" />
                    </div>
                    <p class="box-progress-percentage">50%</p>
                </div>
                <div class="project-box-footer">
                    <div class="participants">
                        <img
                            src="https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1215&q=80"
                            alt="participant" />
                        <img
                            src="https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2555&q=80"
                            alt="participant" />
                        <button class="add-participant" style="color: #4f3ff0;">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="3"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="feather feather-plus">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </button>
                    </div>
                    <div class="days-left" style="color: #4f3ff0;">
                        2 Days Left
                    </div>
                </div>
            </div>
        </div>
        <div class="project-box-wrapper">
            <div class="project-box">
                <div class="project-box-header">
                    <span>December 10, 2020</span>
                    <div class="more-wrapper">
                        <button class="project-btn-more">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="feather feather-more-vertical">
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" /></svg>
                        </button>
                    </div>
                </div>
                <div class="project-box-content-header">
                    <p class="box-content-header">Svg Animations</p>
                    <p class="box-content-subheader">Prototyping</p>
                </div>
                <div class="box-progress-wrapper">
                    <p class="box-progress-header">Progress</p>
                    <div class="box-progress-bar">
                        <span
                            class="box-progress"
                            style="width: 80%; background-color: #096c86" />
                    </div>
                    <p class="box-progress-percentage">80%</p>
                </div>
                <div class="project-box-footer">
                    <div class="participants">
                        <img
                            src="https://images.unsplash.com/photo-1587628604439-3b9a0aa7a163?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjR8fHdvbWFufGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60"
                            alt="participant" />
                        <img
                            src="https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1215&q=80"
                            alt="participant" />
                        <button class="add-participant" style="color: #096c86;">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="3"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="feather feather-plus">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </button>
                    </div>
                    <div class="days-left" style="color: #096c86;">
                        2 Days Left
                    </div>
                </div>
            </div>
        </div>
        <div class="project-box-wrapper">
            <div class="project-box" style="background-color: #ffd3e2;">
                <div class="project-box-header">
                    <span>December 10, 2020</span>
                    <div class="more-wrapper">
                        <button class="project-btn-more">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="feather feather-more-vertical">
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" /></svg>
                        </button>
                    </div>
                </div>
                <div class="project-box-content-header">
                    <p class="box-content-header">UI Development</p>
                    <p class="box-content-subheader">Prototyping</p>
                </div>
                <div class="box-progress-wrapper">
                    <p class="box-progress-header">Progress</p>
                    <div class="box-progress-bar">
                        <span
                            class="box-progress"
                            style="width: 20%; background-color: #df3670" />
                    </div>
                    <p class="box-progress-percentage">20%</p>
                </div>
                <div class="project-box-footer">
                    <div class="participants">
                        <img
                            src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
                            alt="participant" />
                        <img
                            src="https://images.unsplash.com/photo-1587628604439-3b9a0aa7a163?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjR8fHdvbWFufGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60"
                            alt="participant" />
                        <button class="add-participant" style="color: #df3670;">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="3"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="feather feather-plus">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </button>
                    </div>
                    <div class="days-left" style="color: #df3670;">
                        2 Days Left
                    </div>
                </div>
            </div>
        </div>
        <div class="project-box-wrapper">
            <div class="project-box" style="background-color: #c8f7dc;">
                <div class="project-box-header">
                    <span>December 10, 2020</span>
                    <div class="more-wrapper">
                        <button class="project-btn-more">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="feather feather-more-vertical">
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" /></svg>
                        </button>
                    </div>
                </div>
                <div class="project-box-content-header">
                    <p class="box-content-header">Data Analysis</p>
                    <p class="box-content-subheader">Prototyping</p>
                </div>
                <div class="box-progress-wrapper">
                    <p class="box-progress-header">Progress</p>
                    <div class="box-progress-bar">
                        <span
                            class="box-progress"
                            style="width: 60%; background-color: #34c471" />
                    </div>
                    <p class="box-progress-percentage">60%</p>
                </div>
                <div class="project-box-footer">
                    <div class="participants">
                        <img
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
                            alt="participant" />
                        <img
                            src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTB8fG1hbnxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60"
                            alt="participant" />
                        <button class="add-participant" style="color: #34c471;">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="3"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="feather feather-plus">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </button>
                    </div>
                    <div class="days-left" style="color: #34c471;">
                        2 Days Left
                    </div>
                </div>
            </div>
        </div>
        <div class="project-box-wrapper">
            <div class="project-box" style="background-color: #d5deff;">
                <div class="project-box-header">
                    <span>December 10, 2020</span>
                    <div class="more-wrapper">
                        <button class="project-btn-more">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="feather feather-more-vertical">
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" /></svg>
                        </button>
                    </div>
                </div>
                <div class="project-box-content-header">
                    <p class="box-content-header">Web Designing</p>
                    <p class="box-content-subheader">Prototyping</p>
                </div>
                <div class="box-progress-wrapper">
                    <p class="box-progress-header">Progress</p>
                    <div class="box-progress-bar">
                        <span
                            class="box-progress"
                            style="width: 40%; background-color: #4067f9" />
                    </div>
                    <p class="box-progress-percentage">40%</p>
                </div>
                <div class="project-box-footer">
                    <div class="participants">
                        <img
                            src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
                            alt="participant" />
                        <img
                            src="https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2555&q=80"
                            alt="participant" />
                        <button class="add-participant" style="color: #4067f9;">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="3"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="feather feather-plus">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </button>
                    </div>
                    <div class="days-left" style="color: #4067f9;">
                        2 Days Left
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
