try {
          const response = await login(values.userCode, values.password);
          console.log(response.user);
          if (response.success && response.user) {
            // If login is successful, navigate to the managementdashboard
            let accessToken = response.user.token.token;

            if (accessToken && verify(accessToken)) {
              setSession(accessToken);
              localStorage.setItem('RoleIdForSideBar', response.user.roleId);

              navigate(
                '/extended-sidebar/Consumption/Equipmentwisedetails/Equipmentwisedetails'
              );
              generateMenuItems();
            }
          } else {
            if (response.message === 'incorrect_usercode') {
              setErrors({
                userCode: t('Incorrect usercode')
              });
            } else if (response.message === 'Incorrect password.') {
              setErrors({
                password: t('Incorrect Password')
              });
            } else {
              setErrors({
                submit: t('Login failed')
              });
            }
            setStatus({ success: false });
          }

          if (isMountedRef.current) {
            setSubmitting(false);
          }
        } catch (err) {
          console.error(err);
          setErrors({
            submit: t('An error occurred while processing your request')
          });
          setSubmitting(false);
        }